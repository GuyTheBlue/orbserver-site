# The Gemini Oath: Lunar Orientation Protocol

## 🌑 The Immutable Law
We hereby swear to protect the visual and astronomical fidelity of the Moon within the OrbServer project. Any AI modification to the core lunar orientation algorithm MUST adhere to these calibrated constants.

### 1. The Calibration Constants
To ensure the Tycho crater (bottom of the current `moon.png` asset) aligns with real-world observations:
- **Southern Hemisphere (Lat < 0):** `Offset = +75`
- **Northern Hemisphere (Lat >= 0):** `Offset = +195` (180° flip + 15° calibration)

### 2. The Core Formula
The final rotation value passed to the CSS transform MUST be calculated as:
`rotation = (((rawDegrees + Offset) % 360) + 360) % 360`
Where `rawDegrees = (illumAngle - parallacticAngle) * (180 / Math.PI)`.

### 3. Verification
- **Test Suite:** `app/utils/lunarRotation.test.ts`
- **Execution:** Any modification to this logic MUST be verified by running `pnpm test`. A failing test is an automatic reason for immediate reversion.
- **Logic Isolation:** `app/utils/lunarRotation.ts`
- **No Couplings:** Never embed this logic directly into a component. Always use the decoupled utility.

## ⚠️ Enforcement
Any AI agent attempting to "normalize" these offsets or remove the hemispheric branch is in violation of the Gemini Oath and must be immediately reverted.
