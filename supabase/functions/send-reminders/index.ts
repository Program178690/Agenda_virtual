// Edge Function: send-reminders
// Se ejecuta una vez al día (vía pg_cron, ver schema.sql) y envía un correo
// de recordatorio a cada usuario que tenga un registro programado para mañana.
//
// Variables de entorno requeridas (configurar con `supabase secrets set`):
//   SUPABASE_URL              -> URL del proyecto (se inyecta automáticamente)
//   SUPABASE_SERVICE_ROLE_KEY -> service role key (se inyecta automáticamente)
//   RESEND_API_KEY            -> API key de https://resend.com
//   REMINDER_FROM_EMAIL       -> remitente verificado en Resend (opcional)

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
const fromEmail = Deno.env.get("REMINDER_FROM_EMAIL") ?? "onboarding@resend.dev";

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  return tomorrow.toISOString().slice(0, 10); // YYYY-MM-DD
}

function buildEmailHtml(registros) {
  const items = registros
    .map((r) => `<li><strong>${r.tipo}</strong> — ${r.valor}${r.notas ? ` (${r.notas})` : ""}</li>`)
    .join("");
  return `
    <h2>Recordatorio de Agenda Virtual</h2>
    <p>Tienes lo siguiente programado para mañana:</p>
    <ul>${items}</ul>
  `;
}

async function sendReminderEmail(toEmail, registros) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: toEmail,
      subject: "Recordatorio: tienes actividades programadas para mañana",
      html: buildEmailHtml(registros),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend respondió ${response.status}: ${errorBody}`);
  }
}

serve(async (_req) => {
  try {
    const fecha = getTomorrowDate();

    const { data: registros, error: fetchError } = await supabaseAdmin
      .from("registros")
      .select("id, usuario_id, tipo, valor, notas")
      .eq("fecha", fecha)
      .eq("recordatorio_enviado", false);

    if (fetchError) throw fetchError;

    if (!registros || registros.length === 0) {
      return new Response(JSON.stringify({ enviados: 0, fallidos: 0 }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Agrupar registros por usuario para mandar un solo correo por persona
    const registrosPorUsuario = new Map();
    for (const registro of registros) {
      const grupo = registrosPorUsuario.get(registro.usuario_id) ?? [];
      grupo.push(registro);
      registrosPorUsuario.set(registro.usuario_id, grupo);
    }

    let enviados = 0;
    let fallidos = 0;
    const idsEnviados = [];

    for (const [usuarioId, registrosUsuario] of registrosPorUsuario) {
      try {
        const { data: userData, error: userError } =
          await supabaseAdmin.auth.admin.getUserById(usuarioId);
        if (userError || !userData?.user?.email) {
          throw userError ?? new Error("Usuario sin email");
        }

        await sendReminderEmail(userData.user.email, registrosUsuario);
        enviados += 1;
        idsEnviados.push(...registrosUsuario.map((r) => r.id));
      } catch (error) {
        console.error(`Error enviando recordatorio a usuario ${usuarioId}:`, error);
        fallidos += 1;
      }
    }

    if (idsEnviados.length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from("registros")
        .update({ recordatorio_enviado: true })
        .in("id", idsEnviados);
      if (updateError) throw updateError;
    }

    return new Response(JSON.stringify({ enviados, fallidos }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en send-reminders:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
