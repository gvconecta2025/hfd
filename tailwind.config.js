/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hfd-bg': '#E2E8F0',        // Cinza Claro Slate (Fundo principal - substitui o gelo para contraste real)
        'hfd-panel': '#FFFFFF',     // Branco Puro (Contraste total contra o fundo cinza)
        'hfd-input': '#F8FAFC',     // Off-white muito suave (para os inputs se destacarem no painel branco)
        'hfd-text': '#1F2937',      // Cinza Chumbo Slate (alto contraste para texto)
        'hfd-accent': '#64748B',    // Cinza Slate Médio (rótulos e secundário)
        'hfd-border': '#CBD5E1',    // Slate Médio para bordas claras e visíveis
        'hfd-blue': '#1D3ECF',      // Azul Marinho Moderno (Mantém o azul vibrante para ação)
        'hfd-blue-hover': '#162A9B', 
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
