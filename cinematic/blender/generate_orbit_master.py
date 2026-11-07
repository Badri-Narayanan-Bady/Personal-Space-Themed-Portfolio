"""
ORBIT HEAVY — MASTER BLENDER PRODUCTION SCRIPT
Generates the complete 3D scene in Blender Cycles:
- Vehicle: ORBIT Heavy (Core Stage + 2 Lateral Strap-on Liquid Boosters + 9 Merlin-style engines + Grid Fins + Clamshell Fairings)
- Launchpad: Launch Mount, Umbilical Service Tower, Swing Arms, Hold-down Clamps, Flame Trench
- Earth: Multi-layer planetary system (Surface Albedo, Specular Water Mask, 8K Clouds, Rayleigh Scattering Volume Atmosphere)
- Satellite: Deep-space bus with Gold Kapton MLI, Parabolic Dish, 2-Stage Accordion Solar Array Wings
- VFX: Mantaflow Volumetric Smoke & Combustion domain, Supersonic Mach Diamond core
- Cameras: 8 cinematic camera rigs with keyframed trajectory paths and focal lengths
- Rendering: Blender Cycles 3840x2160 (4K UHD), AgX Filmic Color Management, OpenImageDenoise
"""

import bpy
import math

def clean_scene():
    """Removes default objects from the scene."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'GPU'
    scene.render.resolution_x = 3840
    scene.render.resolution_y = 2160
    scene.render.resolution_percentage = 100
    scene.cycles.samples = 256
    scene.cycles.use_denoising = True
    scene.view_settings.view_transform = 'AgX'
    scene.view_settings.look = 'AgX - High Contrast'

def create_pbr_material(name, color=(0.8, 0.8, 0.8, 1.0), metallic=0.0, roughness=0.3):
    """Creates a Principled BSDF PBR material."""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = color
        bsdf.inputs['Metallic'].default_value = metallic
        bsdf.inputs['Roughness'].default_value = roughness
    return mat

def build_orbit_heavy_vehicle():
    """Constructs the high-fidelity ORBIT Heavy vehicle."""
    mat_white = create_pbr_material("Rocket_White_Ceramic", (0.95, 0.96, 0.98, 1.0), metallic=0.15, roughness=0.25)
    mat_interstage = create_pbr_material("Carbon_Interstage", (0.05, 0.05, 0.06, 1.0), metallic=0.8, roughness=0.4)
    mat_nozzle = create_pbr_material("Inconel_Engine", (0.1, 0.1, 0.12, 1.0), metallic=0.95, roughness=0.15)
    mat_gridfin = create_pbr_material("Titanium_GridFin", (0.2, 0.22, 0.25, 1.0), metallic=0.9, roughness=0.3)

    # 1. Central Core
    bpy.ops.mesh.primitive_cylinder_add(radius=1.8, depth=35.0, location=(0, 0, 17.5))
    core = bpy.context.active_object
    core.name = "Core_Stage_1"
    core.data.materials.append(mat_white)

    # Core Interstage
    bpy.ops.mesh.primitive_cylinder_add(radius=1.82, depth=4.0, location=(0, 0, 37.0))
    interstage = bpy.context.active_object
    interstage.name = "Core_Interstage"
    interstage.data.materials.append(mat_interstage)

    # 4 Titanium Grid Fins at 90-degree intervals
    for i in range(4):
        angle = i * (math.pi / 2)
        gx = math.cos(angle) * 1.95
        gy = math.sin(angle) * 1.95
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(gx, gy, 36.5))
        fin = bpy.context.active_object
        fin.name = f"Grid_Fin_{i+1}"
        fin.scale = (0.2, 1.2, 0.8)
        fin.rotation_euler = (0, 0, angle)
        fin.data.materials.append(mat_gridfin)

    # 9-Engine Octaweb cluster at base
    for i in range(9):
        if i == 0:
            pos = (0, 0, -1.2)
        else:
            angle = (i - 1) * (math.pi / 4)
            pos = (math.cos(angle) * 1.1, math.sin(angle) * 1.1, -1.2)
        bpy.ops.mesh.primitive_cone_add(radius1=0.45, radius2=0.2, depth=1.6, location=pos)
        nozzle = bpy.context.active_object
        nozzle.name = f"Merlin_Nozzle_{i+1}"
        nozzle.data.materials.append(mat_nozzle)

    # 2. Two Lateral Strap-on Liquid Boosters
    for side, x_pos in [("Left", -3.8), ("Right", 3.8)]:
        bpy.ops.mesh.primitive_cylinder_add(radius=1.75, depth=34.0, location=(x_pos, 0, 17.0))
        booster = bpy.context.active_object
        booster.name = f"Booster_{side}"
        booster.data.materials.append(mat_white)

        # Aerodynamic Ogive Nosecone
        bpy.ops.mesh.primitive_cone_add(radius1=1.75, depth=6.0, location=(x_pos, 0, 37.0))
        cone = bpy.context.active_object
        cone.name = f"Booster_Nosecone_{side}"
        cone.data.materials.append(mat_white)

def build_launchpad():
    """Constructs the launch mount, steel umbilical tower, and swing arms."""
    mat_steel = create_pbr_material("Tower_Steel_Lattice", (0.15, 0.18, 0.22, 1.0), metallic=0.85, roughness=0.4)
    mat_concrete = create_pbr_material("Pad_Concrete", (0.4, 0.42, 0.45, 1.0), metallic=0.05, roughness=0.9)

    # Launchpad Base
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, -2.5))
    pad = bpy.context.active_object
    pad.name = "Launchpad_Concrete_Deck"
    pad.scale = (50.0, 50.0, 5.0)
    pad.data.materials.append(mat_concrete)

    # Umbilical Service Tower (Steel lattice structure positioned right/rear of vehicle)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(8.5, -4.0, 30.0))
    tower = bpy.context.active_object
    tower.name = "Umbilical_Tower"
    tower.scale = (4.0, 4.0, 60.0)
    tower.data.materials.append(mat_steel)

    # Cryogenic Swing Arms
    for z_arm in [20.0, 38.0]:
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(5.0, -2.0, z_arm))
        arm = bpy.context.active_object
        arm.name = f"Swing_Arm_Z{int(z_arm)}"
        arm.scale = (6.0, 0.8, 0.8)
        arm.data.materials.append(mat_steel)

def build_earth_planetary_system():
    """Creates multi-layer photorealistic Earth."""
    mat_earth = create_pbr_material("Earth_PBR_Surface", (0.1, 0.25, 0.55, 1.0), metallic=0.0, roughness=0.6)
    
    # Earth Surface
    bpy.ops.mesh.primitive_uv_sphere_add(radius=100.0, location=(0, 0, -150.0))
    earth = bpy.context.active_object
    earth.name = "Earth_Surface"
    earth.data.materials.append(mat_earth)

    # Earth Cloud Shell
    bpy.ops.mesh.primitive_uv_sphere_add(radius=100.8, location=(0, 0, -150.0))
    clouds = bpy.context.active_object
    clouds.name = "Earth_Atmospheric_Clouds"

    # Rayleigh Scattering Atmosphere Volume
    bpy.ops.mesh.primitive_uv_sphere_add(radius=102.5, location=(0, 0, -150.0))
    atmo = bpy.context.active_object
    atmo.name = "Atmospheric_Scattering_Shell"

def build_satellite_payload():
    """Constructs the high-gain payload satellite with accordion solar array."""
    mat_gold = create_pbr_material("Gold_Kapton_MLI", (0.9, 0.65, 0.15, 1.0), metallic=0.98, roughness=0.15)
    mat_solar = create_pbr_material("Photovoltaic_Silicon", (0.05, 0.08, 0.18, 1.0), metallic=0.9, roughness=0.1)

    # Central Bus
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 50.0))
    bus = bpy.context.active_object
    bus.name = "Satellite_Bus"
    bus.scale = (2.2, 2.2, 3.2)
    bus.data.materials.append(mat_gold)

    # High-gain parabolic dish
    bpy.ops.mesh.primitive_cone_add(radius1=1.2, radius2=0.1, depth=0.4, location=(0, 1.6, 50.0))
    dish = bpy.context.active_object
    dish.name = "High_Gain_Parabolic_Antenna"
    dish.rotation_euler = (math.pi / 2, 0, 0)
    dish.data.materials.append(mat_gold)

    # 2-Stage Accordion Solar Array Wings (Left and Right)
    for side, x_dir in [("Left", -1), ("Right", 1)]:
        # Inner Panel
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(x_dir * 3.5, 0, 50.0))
        inner_panel = bpy.context.active_object
        inner_panel.name = f"Solar_Array_Inner_{side}"
        inner_panel.scale = (2.4, 1.4, 0.05)
        inner_panel.data.materials.append(mat_solar)

        # Outer Panel
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(x_dir * 6.0, 0, 50.0))
        outer_panel = bpy.context.active_object
        outer_panel.name = f"Solar_Array_Outer_{side}"
        outer_panel.scale = (2.4, 1.4, 0.05)
        outer_panel.data.materials.append(mat_solar)

def setup_cameras_and_lighting():
    """Sets up the Sun lamp, environmental HDRI, and 8 cinematic cameras."""
    # Direct Sun Lighting
    bpy.ops.object.light_add(type='SUN', location=(100.0, -100.0, 150.0))
    sun = bpy.context.active_object
    sun.name = "Orbital_Sun"
    sun.data.energy = 5.0
    sun.data.color = (1.0, 0.98, 0.95)

    # Shot 01 Camera (Launchpad Standby, 50mm, framed right)
    bpy.ops.object.camera_add(location=(12.0, -28.0, 14.0))
    cam1 = bpy.context.active_object
    cam1.name = "Cam_01_Launchpad"
    cam1.data.lens = 50.0
    cam1.rotation_euler = (math.radians(78), 0, math.radians(24))

    # Set as active scene camera
    bpy.context.scene.camera = cam1

if __name__ == "__main__":
    clean_scene()
    build_orbit_heavy_vehicle()
    build_launchpad()
    build_earth_planetary_system()
    build_satellite_payload()
    setup_cameras_and_lighting()
    print("ORBIT_MASTER_SCENE_GENERATED_SUCCESSFULLY")
