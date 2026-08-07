import { useCallback, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";

export function useRegistros() {
  const { user } = useAuth();
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRegistros = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("registros")
      .select("*")
      .eq("usuario_id", user.id)
      .order("fecha", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setRegistros(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchRegistros();
  }, [fetchRegistros]);

  async function crearRegistro({ tipo, valor, fecha, notas, estado, prioridad }) {
  const { data, error } = await supabase
    .from("registros")
    .insert([{ usuario_id: user.id, tipo, valor, fecha, notas, estado, prioridad }])
    .select();
  if (error) throw error;
  setRegistros((prev) => [data[0], ...prev]);
}

  async function actualizarRegistro(id, cambios) {
    const { data, error } = await supabase
      .from("registros")
      .update(cambios)
      .eq("id", id)
      .select();
    if (error) throw error;
    setRegistros((prev) =>
      prev.map((r) => (r.id === id ? data[0] : r))
    );
  }

  async function eliminarRegistro(id) {
    const { error } = await supabase.from("registros").delete().eq("id", id);
    if (error) throw error;
    setRegistros((prev) => prev.filter((r) => r.id !== id));
  }

  return {
    registros,
    loading,
    error,
    crearRegistro,
    actualizarRegistro,
    eliminarRegistro,
    refetch: fetchRegistros,
  };
}
