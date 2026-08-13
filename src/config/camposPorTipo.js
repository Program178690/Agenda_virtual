// src/config/camposPorTipo.js
// Define qué campos mostrar en el formulario según el tipo de registro elegido.
// Cada campo se guarda dentro de la columna "detalles" (jsonb) del registro.

export const CAMPOS_POR_TIPO = {
  ejercicio: [
    {
      key: 'actividad',
      label: 'Actividad',
      type: 'select',
      opciones: ['Correr', 'Pesas', 'Natación', 'Ciclismo', 'Otro'],
    },
    { key: 'minutos', label: 'Minutos', type: 'number' },
    { key: 'distancia_km', label: 'Distancia (km)', type: 'number' },
  ],
  sueño: [
    { key: 'horas', label: 'Horas dormidas', type: 'number' },
    {
      key: 'calidad',
      label: 'Calidad',
      type: 'select',
      opciones: ['Mala', 'Regular', 'Buena', 'Excelente'],
    },
  ],
  alimentación: [
    {
      key: 'comida',
      label: 'Comida',
      type: 'select',
      opciones: ['Desayuno', 'Almuerzo', 'Cena', 'Snack', 'Otro'],
    },
    { key: 'calorias_aprox', label: 'Calorías aprox.', type: 'number' },
  ],
  estudio: [
    {
      key: 'tema',
      label: 'Tema',
      type: 'select',
      opciones: ['Matemáticas', 'Programación', 'Idiomas', 'Otro'],
    },
    { key: 'minutos', label: 'Minutos', type: 'number' },
  ],
  lectura: [
    { key: 'libros', label: 'Libros leídos', type: 'number' },
    { key: 'paginas', label: 'Páginas', type: 'number' },
    { key: 'minutos', label: 'Minutos', type: 'number' },
  ],
  otro: [
    { key: 'descripcion', label: 'Descripción', type: 'text' },
    { key: 'valor_libre', label: 'Valor', type: 'number' },
  ],
};

// El campo que alimenta el "valor" numérico principal (el que ya usan
// las gráficas del Dashboard), por cada tipo.
export const CAMPO_VALOR_PRINCIPAL = {
  ejercicio: 'minutos',
  sueño: 'horas',
  alimentación: 'calorias_aprox',
  estudio: 'minutos',
  lectura: 'minutos',
  otro: 'valor_libre',
};