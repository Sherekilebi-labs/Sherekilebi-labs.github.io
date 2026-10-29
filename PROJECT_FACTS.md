# Project facts and editorial follow-up

This is an authoring reference, not public website content. Updated 29 October 2026.

The site distinguishes implemented software, dated build updates, goals, and measured results. The owner’s correction that LARA uses Isaac Sim takes precedence over the old MuJoCo source tree. Repository code alone does not establish a hardware test result.

| Project | Published basis | Evidence | Awaiting confirmation |
|---|---|---|---|
| L.A.R.A. | Six-axis arm; owner-confirmed individual v1 joint tests; completed/printed v2 design; tool changer being revised; stochastic tracking-error research planned | Owner clarification in this conversation, 29 October 2026; original simulator correction; dated news updates | Existing image renderer/revision still unconfirmed; MBZUAI support wording; coordinated motion and task performance not tested; no measured accuracy or validated predictive compensation claimed. |
| Pop-up Spoiler | Two ESP32 boards, four motors, four-bar mechanisms, tunable commands; prototype | Current local Project Tsintsadze README and existing curated site record | Installed state; physical fault/clearance/tracking tests; aerodynamic measurements. Code-defined behavior is described as firmware behavior. |
| Tekkai 2.0 | Current firmware reviewed and compiled; 3 ultrasonic channels, 2 edge sensors, remote enable, Wi-Fi debug; target pursuit precedes edge checks | Owner-selected `~/program files/PlatformIO/Projects/Sumo 2026`; published `Sherekilebi-labs/Tekkai-2.0`, commit `4fa08debfc18766a6b31a79b9e20a7fe3df6309f` | Competition outcome and measured hardware performance remain unclaimed. Historical 2024 source is separately labeled. |
| CupExS | Racer, separate timer, dyno; model fitting of two gear-ratio motion experiments | `../CupExS 2026/data analysis/rear_wheel_model_fit_results.md`; CSVs and theoretical model; existing curated site record | Measured ten-metre timings, repeats/uncertainty, event outcome and final public selection of numeric results. No fitted terminal speed is presented as measured speed. Numeric RMSE is withheld pending confirmation. |
| Door Security | Firmware for beam/tamper detection, alarm, local web panel, optional email | Current firmware and existing curated site record | Actual installation/use, range, false-trigger rate, power/network recovery and email configuration. No reliability guarantee added. |
| GYM Scale | Load-cell firmware, BLE transport, Flutter app and local records | Current firmware/app README and existing curated site record | Physical sensor rating, calibration/accuracy/repeatability and tested release platforms. Configured 10 kg is not published as verified physical capacity. |

LARA simulation media is retained as earlier-model reference imagery without attributing the existing renders to Isaac Sim. Clarify provenance before adding that attribution. The joint-sweep animation runs automatically without playback controls, per the latest owner request.

All project contributor arrays remain empty until actual roles are confirmed. Existing people/affiliation information is retained with grammar and capitalization normalized. Academic years were not advanced automatically.

Owner clarification: no coordinated sequence or task has been simulated or tested on the real arm. Individual joints working is the current physical validation. The stochastic study aims to use real motion-error data to investigate prediction and target adjustment; it is not a claim that random noise is necessarily predictable.

29 October follow-up: owner confirmed 5 functional CupExS kits. Removed its Testing and results section and analysis chart from the page. Simulation stills were removed; only the illustrative animation remains. Current interaction preferences supersede the earlier manual-carousel and opt-in-3D choices: 3-second autoplay with hover pause/resume, and automatically loaded CAD with a bright Explore in 3D sign.
