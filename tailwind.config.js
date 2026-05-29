/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hfd-bg': '#FFEBE8',      // Fundo rosinha/off-white da imagem
        'hfd-blue': '#1D3ECF',    // Azul vibrante (Botões e destaques primários)
        'hfd-yellow': '#E6AF00',  // Amarelo/Mostarda (Avisos)
        'hfd-green': '#D7F7E1',   // Verde claro (Sucesso)
        'hfd-red': '#B72818',     // Vermelho escuro (Erros)
        'hfd-panel': '#FFFFFF',   // Branco puro para os formulários
        'hfd-text': '#1F2937',    // Cinza bem escuro para o texto ficar legível
        'hfd-accent': '#6B7280',  // Cinza médio para rótulos
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}