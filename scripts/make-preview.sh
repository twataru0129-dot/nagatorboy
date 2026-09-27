#!/usr/bin/env bash
# GitHub Pages 用の preview.mp4（1280×720 / 30fps / H.264 + AAC）と poster.jpg を作り直す
# 使い方: npm run preview
#   ブラウザの場所を指定したい時: REMOTION_BROWSER=/path/to/chrome npm run preview
set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p out
BROWSER_ARGS=()
if [ -n "${REMOTION_BROWSER:-}" ]; then
	BROWSER_ARGS=(--browser-executable="$REMOTION_BROWSER")
fi

# 1) フルHDで書き出し（高画質）
npx remotion render LifeRoleVideo out/master-1080p.mp4 --codec=h264 --crf=16 --audio-codec=aac --audio-bitrate=192k "${BROWSER_ARGS[@]}"

# 2) 1280×720 に縮小して、スマホで再生しやすい形式にする
npx remotion ffmpeg -y -loglevel error -i out/master-1080p.mp4 \
	-vf "scale=1280:720:flags=lanczos:in_range=pc:out_range=tv,format=yuv420p" -color_range tv -r 30 \
	-c:v libx264 -profile:v high -level 4.0 -crf 23 -preset slow \
	-c:a aac -b:a 128k -ar 48000 -movflags +faststart preview.mp4

# 3) ページ用のポスター画像（タイトル場面）
npx remotion ffmpeg -y -loglevel error -ss 7 -i preview.mp4 -frames:v 1 -q:v 3 poster.jpg

# 4) ブラウザや GitHub Pages に古い動画が残らないよう、index.html の版番号を更新
VERSION=$(date +%Y%m%d%H%M)
sed -i.bak -E "s/(preview\.mp4|poster\.jpg)\?v=[0-9A-Za-z]+/\1?v=${VERSION}/g" index.html && rm -f index.html.bak

echo "preview.mp4 と poster.jpg を更新しました（版番号 v=${VERSION}）"
