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

---

## IMMUTABLE SCIENTIFIC LAWS
### 1. Lunar Orientation & Illumination
To ensure absolute geographic accuracy (Southern Hemisphere awareness), the moon's apparent rotation MUST be calculated using SunCalc's native `parallacticAngle`. 

**The Formula:**
`apparentRotation = (illum.angle - pos.parallacticAngle) * (180 / Math.PI) + 90`

*   `illum.angle`: Positional angle of the bright limb.
*   `pos.parallacticAngle`: Native SunCalc property (added in v1.8.0) for observer-zenith correction.
*   `+ 90`: Calibration offset to align NH-base SVG assets (defaulting to lit-on-right) with SunCalc's 0° (North) reference.

**CRITICAL:** NEVER simplify or manually recalculate the parallactic angle ($h$). Always use the SunCalc property `pos.parallacticAngle`.
