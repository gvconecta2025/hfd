// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'hfd-bg': '#F8FAFC',        // Branco Gelo / Off-white focado em leitura
        'hfd-panel': '#FFFFFF',     // Fundo dos cards e inputs
        'hfd-text': '#1E293B',      // Cinza Slate Chumbo (alto contraste para texto)
        'hfd-accent': '#64748B',    // Cinza Slate Médio (rótulos e secundário)
        'hfd-border': '#E2E8F0',    // Slate Leve para bordas
        'hfd-primary': '#0EA5E9',   // Azul Sky Vibrante (destaque)
        'hfd-primary-hover': '#0284C7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Aumentando a escala para facilitar o uso (UX) - Base 18px
        'xs': ['0.875rem', { lineHeight: '1.25rem' }],   // 14px (anteriormente 12px)
        'sm': ['1rem', { lineHeight: '1.5rem' }],        // 16px (anteriormente 14px)
        'base': ['1.125rem', { lineHeight: '1.75rem' }], // 18px (anteriormente 16px)
        'lg': ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
        'xl': ['1.5rem', { lineHeight: '2rem' }],       // 24px
      },
    },
  },
  plugins: [],
}