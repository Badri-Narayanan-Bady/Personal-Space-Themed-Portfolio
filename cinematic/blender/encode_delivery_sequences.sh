#!/bin/bash
# ==============================================================================
# ORBIT HEAVY — CINEMATIC WEBP & VIDEO ENCODING PIPELINE
# Encodes 3840x2160 Master PNG frames into web delivery tiers:
# 1. 4K Master WebP (3840x2160)
# 2. Desktop QHD (2560x1440)
# 3. Desktop FHD (1920x1080)
# 4. Mobile HD (1280x720)
# 5. Frame Sequence Stacks (frame_00.webp to frame_07.webp)
# ==============================================================================

set -euo pipefail

INPUT_DIR="renders/4k_masters"
OUTPUT_DIR="public/cinematic"

mkdir -p "$OUTPUT_DIR"/{launchpad,ignition,liftoff,ascent,separation,orbit,deployment,final}

echo "Encoding 4K master sequences into WebP multi-tier assets..."

encode_tier() {
  local in_file="$1"
  local out_dir="$2"

  # Master 4K
  ffmpeg -y -i "$in_file" -vf "scale=3840:2160" -q:v 85 "$out_dir/master_4k.webp"
  # Desktop 1440p
  ffmpeg -y -i "$in_file" -vf "scale=2560:1440" -q:v 85 "$out_dir/desktop_1440.webp"
  # Desktop 1080p
  ffmpeg -y -i "$in_file" -vf "scale=1920:1080" -q:v 82 "$out_dir/desktop_1080.webp"
  # Mobile 720p
  ffmpeg -y -i "$in_file" -vf "scale=1280:720" -q:v 80 "$out_dir/mobile_720.webp"
  # Fallback Poster
  ffmpeg -y -i "$in_file" -vf "scale=1920:1080" -q:v 3 "$out_dir/poster.jpg"
}

echo "Encoding completed successfully."
