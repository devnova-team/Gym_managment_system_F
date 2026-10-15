/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Theme base surfaces
        panelDark: "#0c101d",       // Dark mode panel content
        sidebarDark: "#0e1517",     // Dark mode side panel & navbar
        navbarDark: "#0e1517",      // Dark mode navbar
        cardDark: "#0e1517",        // Dark mode card container
        cardElevatedDark: "#111726",// Elevated card in dark mode
        borderDark: "#1a2333",      // Subtle dark border

        // Image 3 - Row 2 (Primary Electric Lime / Forest Green scale)
        main: "#85F40F",            // Row 2 - Swatch 1: Primary Electric Lime
        subMain: "#6CC80A",         // Row 2 - Swatch 2: Vibrant Leaf Green
        leafGreen: "#549E06",       // Row 2 - Swatch 3: Strong Forest Green
        deepGreen: "#3D7603",       // Row 2 - Swatch 4: Deep Leaf Green
        forestDark: "#275001",      // Row 2 - Swatch 5: Dark Forest Green (for tab gradients)
        forestDeep: "#132D00",      // Row 2 - Swatch 6: Deep Shadow Green
        forestBase: "#061400",      // Row 2 - Swatch 7: Ultra Dark Green

        // Image 3 - Row 1 (Lime & Olive Scale)
        limePale: "#CFFFAB",        // Row 1 - Swatch 1: Pale Lime Highlight
        limeBright: "#95E913",      // Row 1 - Swatch 2: Vibrant Lime
        limeMid: "#79BE0D",         // Row 1 - Swatch 3: Mid Lime
        oliveDeep: "#5D9408",       // Row 1 - Swatch 4
        oliveDark: "#436D04",       // Row 1 - Swatch 5
        forestRow1Dark: "#2B4802",  // Row 1 - Swatch 6
        forestRow1Base: "#142601",  // Row 1 - Swatch 7

        // Image 3 - Row 3 (Sage & Olive Scale)
        sagePale: "#C6F486",        // Row 3 - Swatch 1
        sageLight: "#A3CA6E",       // Row 3 - Swatch 2
        sageMid: "#82A156",         // Row 3 - Swatch 3
        sageArmy: "#627A40",        // Row 3 - Swatch 4
        sageDark: "#44552B",        // Row 3 - Swatch 5
        sageDeep: "#273317",        // Row 3 - Swatch 6
        sageBase: "#0D1306",        // Row 3 - Swatch 7

        // UI Accents & Text
        accent: "#85F40F",          // Electric Lime Accent
        accentHover: "#95E913",     // Light Lime Hover
        textSecondColor: "#0F2E4A",
        textColor: "#94A3B8",       // Neutral Gray
        hoverColor: "#6CC80A",
        logout: "#EF4444",
        gray: "#94A3B8",
        title: "#85F40F",
        inputsPlaceholder: "#64748B",
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #85F40F 0%, #6CC80A 100%)',
        'tab-active-gradient': 'linear-gradient(90deg, rgba(39, 80, 1, 0.75) 0%, rgba(19, 45, 0, 0.85) 100%)',
        'btn-gradient': 'linear-gradient(135deg, #85F40F 0%, #6CC80A 100%)',
        'btn-gradient-hover': 'linear-gradient(135deg, #95E913 0%, #79BE0D 100%)',
        'card-gradient': 'linear-gradient(180deg, #101625 0%, #0c101d 100%)',
      },
      boxShadow: {
        'smoothCard': '0 4px 20px -2px rgba(0, 0, 0, 0.35), 0 2px 8px -2px rgba(0, 0, 0, 0.25)',
        'smoothCardHover': '0 8px 25px -5px rgba(133, 244, 15, 0.2), 0 4px 10px -5px rgba(0, 0, 0, 0.3)',
        'neonGlow': '0 0 25px -2px rgba(133, 244, 15, 0.45)',
        'neonGlowSm': '0 0 12px -1px rgba(133, 244, 15, 0.35)',
      }
    },
  },
  plugins: [],
}
