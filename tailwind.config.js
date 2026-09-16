/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '360px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
    },
    extend: {
      colors: {
        // --- AFYA token palette (CSS vars defined in src/index.css) ---
        petra: {
          DEFAULT: 'var(--afya-petra-rose)',
          deep: 'var(--afya-petra-rose-deep)',
          soft: 'var(--afya-petra-rose-soft)',
        },
        sand: {
          DEFAULT: 'var(--afya-rum-sand)',
          deep: 'var(--afya-rum-sand-deep)',
          soft: 'var(--afya-rum-sand-soft)',
        },
        teal: {
          DEFAULT: 'var(--afya-deadsea-teal)',
          deep: 'var(--afya-deadsea-teal-deep)',
          soft: 'var(--afya-deadsea-teal-soft)',
        },
        salt: 'var(--afya-salt-white)',
        night: {
          DEFAULT: 'var(--afya-wadi-night)',
          raised: 'var(--afya-night-raised)',
          border: 'var(--afya-night-border)',
        },
        anemone: {
          DEFAULT: 'var(--afya-anemone-red)',
          soft: 'var(--afya-anemone-soft)',
        },
        cream: {
          DEFAULT: 'var(--afya-cream)',
          text: 'var(--afya-cream-text)',
          muted: 'var(--afya-cream-muted)',
        },
        // Semantic (theme-remapped) tokens
        surface: 'var(--afya-surface)',
        raised: 'var(--afya-raised)',
        ink: {
          DEFAULT: 'var(--afya-text)',
          muted: 'var(--afya-text-muted)',
        },
        line: 'var(--afya-border)',
        interactive: {
          DEFAULT: 'var(--afya-interactive)',
          accent: 'var(--afya-interactive-accent)',
        },
        danger: 'var(--afya-danger)',
        // Mood engine
        mood: {
          DEFAULT: 'var(--mood-accent)',
          deep: 'var(--mood-accent-deep)',
          soft: 'var(--mood-accent-soft)',
        },
        // Destination sub-palettes (canonical, never mood-shifted) — design.md §2.3
        dest: {
          'brine-teal': '#2E6B69',
          'mineral-grey': '#8A9A97',
          'thermal-rose': '#C26A4A',
          'steam-cream': '#F6EBDD',
          basalt: '#3E3A36',
          dusk: '#1B1611',
          ember: '#B76E58',
          alabaster: '#EFE3D3',
          'shadow-umber': '#5C4033',
          'gulf-teal': '#3E7E8F',
          coral: '#D9704E',
          pearl: '#F6F2E8',
          'wadi-dusk': '#7A6A8F',
        },
        // shadcn/ui compatibility (vars remapped to AFYA in index.css)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      fontFamily: {
        display: ['Fraunces', '"Noto Kufi Arabic"', 'serif'],
        body: ['Inter', '"Noto Kufi Arabic"', 'system-ui', 'sans-serif'],
        ar: ['"Noto Kufi Arabic"', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(2.75rem, 7vw, 5.5rem)', { lineHeight: '1.02', letterSpacing: '-0.02em', fontWeight: '600' }],
        h1: ['clamp(2.25rem, 5vw, 3.75rem)', { lineHeight: '1.06', letterSpacing: '-0.015em', fontWeight: '600' }],
        h2: ['clamp(1.75rem, 3.4vw, 2.5rem)', { lineHeight: '1.12', letterSpacing: '-0.01em', fontWeight: '600' }],
        h3: ['clamp(1.3rem, 2.2vw, 1.6rem)', { lineHeight: '1.2', fontWeight: '600' }],
        lede: ['clamp(1.1rem, 1.6vw, 1.3rem)', { lineHeight: '1.55', fontWeight: '400' }],
        body: ['1rem', { lineHeight: '1.65' }],
        small: ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '500' }],
        micro: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '600' }],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        pill: 'var(--radius-pill)',
        arch: 'var(--radius-arch)',
        // shadcn compat
        xl: 'calc(var(--radius) + 4px)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        lift: 'var(--shadow-lift)',
        overlay: 'var(--shadow-overlay)',
        glow: 'var(--shadow-glow)',
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
      transitionDuration: {
        instant: '120ms',
        fast: '220ms',
        med: '420ms',
        slow: '800ms',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(.16,1,.3,1)',
        soft: 'cubic-bezier(.4,0,.2,1)',
        breathe: 'cubic-bezier(.37,0,.63,1)',
      },
      maxWidth: {
        content: '1200px',
        prose: '68ch',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'dune-drift': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-24px)' },
        },
        'orb-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
        },
        'grain-shimmer': {
          '0%, 100%': { opacity: '0.05' },
          '50%': { opacity: '0.08' },
        },
        'haze-drift': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-32px)' },
        },
        'ring-expand': {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(1.35)', opacity: '0' },
        },
        'live-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        'ring-rotate': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'dune-drift': 'dune-drift var(--loop-dunes) ease-in-out infinite',
        'orb-pulse': 'orb-pulse var(--loop-orb) var(--ease-breathe) infinite',
        'grain-shimmer': 'grain-shimmer var(--loop-grain) steps(2) infinite',
        'haze-drift': 'haze-drift var(--loop-dunes) ease-in-out infinite',
        'ring-expand': 'ring-expand 2.4s ease-out infinite',
        'live-pulse': 'live-pulse 2s ease-in-out infinite',
        'ring-rotate': 'ring-rotate 24s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
