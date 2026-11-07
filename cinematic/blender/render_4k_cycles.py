"""
ORBIT HEAVY — 4K CYCLES BATCH RENDER PIPELINE
Executes automated 4K UHD rendering (3840x2160) across the 16 key mission frames:
1. Complete rocket on launchpad
2. Detailed engine assembly
3. Pre-ignition illumination
4. Initial combustion
5. Full engine ignition
6. Expanding smoke at launchpad
7. Hold-down release
8. Initial liftoff
9. Rocket clearing launch tower
10. Atmospheric ascent
11. Gravity turn
12. Stage separation
13. Payload fairing separation
14. Orbital insertion
15. Satellite separation and solar-array deployment
16. Final satellite against Earth
"""

import bpy
import os

SHOTS = [
    ("frame_01_launchpad_full", 0, "Cam_01_Launchpad"),
    ("frame_02_engine_assembly", 10, "Cam_02_Engine"),
    ("frame_03_preignition_glow", 20, "Cam_03_PadClose"),
    ("frame_04_initial_combustion", 28, "Cam_04_NozzleFlames"),
    ("frame_05_full_ignition", 35, "Cam_05_FullThrust"),
    ("frame_06_expanding_smoke", 45, "Cam_06_SmokeTrench"),
    ("frame_07_holddown_release", 55, "Cam_07_Release"),
    ("frame_08_initial_liftoff", 65, "Cam_08_LiftoffLow"),
    ("frame_09_tower_clearance", 80, "Cam_09_TowerClear"),
    ("frame_10_atmospheric_ascent", 110, "Cam_10_VaporCone"),
    ("frame_11_gravity_turn", 140, "Cam_11_PitchHorizon"),
    ("frame_12_booster_staging", 170, "Cam_12_Staging"),
    ("frame_13_fairing_jettison", 200, "Cam_13_FairingSplit"),
    ("frame_14_orbital_insertion", 230, "Cam_14_VacuumBurn"),
    ("frame_15_solar_unfolding", 260, "Cam_15_SatelliteDeploy"),
    ("frame_16_stable_orbit_earth", 290, "Cam_16_FinalOrbit"),
]

def render_all_shots(output_dir="renders/4k_masters"):
    os.makedirs(output_dir, exist_ok=True)
    scene = bpy.context.scene

    scene.render.resolution_x = 3840
    scene.render.resolution_y = 2160
    scene.render.resolution_percentage = 100
    scene.cycles.samples = 256
    scene.cycles.use_denoising = True
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.image_settings.color_depth = '16'

    for name, frame_num, cam_name in SHOTS:
        scene.frame_set(frame_num)
        cam = bpy.data.objects.get(cam_name)
        if cam:
            scene.camera = cam
        
        filepath = os.path.join(output_dir, f"{name}.png")
        scene.render.filepath = filepath
        print(f"Rendering 4K frame {name} at frame {frame_num} using {cam_name}...")
        bpy.ops.render.render(write_still=True)

    print("ALL_16_MASTER_FRAMES_RENDERED_AT_3840X2160")

if __name__ == "__main__":
    render_all_shots()
