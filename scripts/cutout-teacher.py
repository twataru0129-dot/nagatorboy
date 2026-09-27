# 人物画像の白い背景だけを透明にするスクリプト（人物の色・形は一切変更しない）
# 使い方: python3 scripts/cutout-teacher.py 入力.png public/assets/teacher.png
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

src, dst = sys.argv[1], sys.argv[2]
img = Image.open(src).convert('RGB')
a = np.asarray(img).astype(np.int16)
h, w, _ = a.shape

# 「白っぽい」画素（明るく、色味が少ない）
mn = a.min(axis=2)
mx = a.max(axis=2)
whiteish = (mn >= 228) & ((mx - mn) <= 18)

# 画像のふちからつながっている白だけを背景とする（歯や目の白は残る）
bg = np.zeros((h, w), dtype=bool)
q = deque()
for x in range(w):
    for y in (0, h - 1):
        if whiteish[y, x] and not bg[y, x]:
            bg[y, x] = True
            q.append((y, x))
for y in range(h):
    for x in (0, w - 1):
        if whiteish[y, x] and not bg[y, x]:
            bg[y, x] = True
            q.append((y, x))
while q:
    y, x = q.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < h and 0 <= nx < w and not bg[ny, nx] and whiteish[ny, nx]:
            bg[ny, nx] = True
            q.append((ny, nx))

alpha = np.where(bg, 0, 255).astype(np.uint8)
# ふちをなめらかに（1px 程度だけぼかす）
alpha_img = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.8))
alpha = np.minimum(np.asarray(alpha_img), np.where(bg, 0, 255)).astype(np.uint8)
alpha = np.where(bg, np.asarray(alpha_img) // 3, alpha).astype(np.uint8)

rgba = np.dstack([np.asarray(img), alpha])
out = Image.fromarray(rgba, 'RGBA')
bbox = out.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
pad = 6
bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(w, bbox[2] + pad), min(h, bbox[3] + pad))
out = out.crop(bbox)
out.save(dst, optimize=True)
print('saved', dst, out.size)
