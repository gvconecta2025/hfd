/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hfd-bg': '#F8FAFC',        // Branco Gelo / Off-white (Fundo principal, limpo)
        'hfd-panel': '#FFFFFF',     // Branco puro para os formulários
        'hfd-text': '#1F2937',      // Cinza Chumbo (alto contraste para texto)
        'hfd-accent': '#6B7280',    // Cinza Slate Médio (rótulos e secundário)
        'hfd-border': '#E5E7EB',    // Slate Leve para bordas
        'hfd-blue': '#1D3ECF',      // Azul Marinho Moderno (Destaques e botões primários)
        'hfd-blue-hover': '#162A9B', 
        'hfd-yellow': '#E6AF00',    // Amarelo Ouro (Avisos)
        'hfd-green': '#D7F7E1',     // Verde claro (Sucesso)
        'hfd-red': '#B72818',       // Vermelho escuro (Erros)
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.875rem', { lineHeight: '1.25rem' }],
        'sm': ['1rem', { lineHeight: '1.5rem' }],
        'base': ['1.125rem', { lineHeight: '1.75rem' }],
        'lg': ['1.25rem', { lineHeight: '1.75rem' }],
        'xl': ['1.5rem', { lineHeight: '2rem' }],
      },
    },
  },
  plugins: [],
}
