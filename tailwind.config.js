// tailwind.config.js en tu proyecto
module.exports = {
    content: [
      "./src/components/pages/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
      // Agregá más rutas si hiciera falta
    ],
    theme: {
      extend: {
        // Copiá los colores, fuentes y demás si usás el mismo diseño
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
      // Lo que use TailAdmin
    ],
  }
  