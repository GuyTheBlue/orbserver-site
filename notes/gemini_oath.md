# Gemini Oath & Plan: Hero Parallax

**Goal:** Build the `<HeroParallax>` component featuring a shimmering glass-hexagon overlay and an absolute-positioned z-index background array simulating a camera lowering behind the dune.

## Plan Steps
- [x] **Step 1:** Install dependency (`@vueuse/core`).
- [x] **Step 2:** Scaffold `app/components/pages/landing/HeroParallax.vue` with the `<ClientOnly>` guard and foundational parallax structure (image layers & scrolling logic).
- [x] **Step 3:** Implement the inline shimmering Hexagon SVG overlay using vanilla CSS and the requested mask-image fading.
- [x] **Step 4:** Design the custom `AppLogo.vue` SVg and build `HeroUI.vue` to house the typography and right-side tech panels.
- [x] **Step 5:** Inject `HeroUI.vue` securely onto the camera track inside `HeroParallax.vue` and draw the dynamic glowing line to the moon.
- [x] **Step 6:** Import the completed `HeroParallax.vue` into the orchestrator (`app/pages/index.vue`).
- [x] **Step 7:** Rework `app/app.vue` to remove the default `UHeader` and create a sleek, scroll-triggered glassy sliding navbar suitable for a SPA.
- [/] **Step 8:** Adjust Moon positioning to "kiss the sea" or sit just below the horizon, and recalibrate the HUD targeting lines.
- [x] **Step 9:** Integrate Google Fonts: Roboto for global text and Orbitron for the logo.

**Current Focus:** Font Integration Complete
