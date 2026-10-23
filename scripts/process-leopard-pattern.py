import subprocess
import struct
import math

input_path = '/Users/angrove/.gemini/antigravity/brain/6e2c2bee-1755-4e8f-b93d-010d9a961119/.user_uploaded/media_1792273695450.jpg'
bmp_in = '/Users/angrove/.gemini/antigravity/scratch/angrove-landing/temp_in.bmp'
bmp_out = '/Users/angrove/.gemini/antigravity/scratch/angrove-landing/temp_out.bmp'
png_out = '/Users/angrove/.gemini/antigravity/scratch/angrove-landing/public/leopard-pattern.png'
svg_out = '/Users/angrove/.gemini/antigravity/scratch/angrove-landing/public/leopard-pattern.svg'

# Convert input to BMP
subprocess.run(['sips', '-s', 'format', 'bmp', input_path, '--out', bmp_in], check=True)

with open(bmp_in, 'rb') as f:
    bmp_data = bytearray(f.read())

offset = struct.unpack('<I', bmp_data[10:14])[0]
width, height = struct.unpack('<ii', bmp_data[18:26])
height = abs(height)

row_padded = (width * 3 + 3) & (~3)

# Extract pixels as 2D array of (B, G, R)
pixels = []
for y in range(height):
    row = []
    # BMP with negative height is top-to-bottom, positive is bottom-to-top
    row_idx = offset + y * row_padded
    for x in range(width):
        b = bmp_data[row_idx + x * 3]
        g = bmp_data[row_idx + x * 3 + 1]
        r = bmp_data[row_idx + x * 3 + 2]
        row.append((r, g, b))
    pixels.append(row)

# Color mapping function:
# Dark spots: deep midnight ink (7, 10, 30)
# Rosette core: rich royal cobalt (32, 60, 208)
# Background fur: electric blue (61, 92, 255)
c_dark = (8, 12, 34)
c_core = (30, 58, 206)
c_bg   = (61, 92, 255)

def map_color(lum):
    # Normalized luminance 0.0 .. 1.0
    # Spot darks are typically lum < 0.35
    # Rosette cores are typically 0.35 .. 0.65
    # Light background is lum > 0.65
    t = lum / 255.0
    if t < 0.38:
        # Interpolate c_dark to c_core
        f = t / 0.38
        # Add curve for rich darks
        f = f ** 1.3
        r = int(c_dark[0] + (c_core[0] - c_dark[0]) * f)
        g = int(c_dark[1] + (c_core[1] - c_dark[1]) * f)
        b = int(c_dark[2] + (c_core[2] - c_dark[2]) * f)
    else:
        # Interpolate c_core to c_bg
        f = (t - 0.38) / (1.0 - 0.38)
        f = min(1.0, max(0.0, f))
        r = int(c_core[0] + (c_bg[0] - c_core[0]) * f)
        g = int(c_core[1] + (c_bg[1] - c_core[1]) * f)
        b = int(c_core[2] + (c_bg[2] - c_core[2]) * f)
    return (r, g, b)

# Apply color mapping
colored_pixels = []
for y in range(height):
    row = []
    for x in range(width):
        r, g, b = pixels[y][x]
        # Perceptual luminance
        lum = 0.299 * r + 0.587 * g + 0.114 * b
        nr, ng, nb = map_color(lum)
        row.append((nr, ng, nb))
    colored_pixels.append(row)

# Make seamless using horizontal and vertical feather blending on borders (width=W, height=H)
W = width
H = height
feather_x = int(W * 0.15)
feather_y = int(H * 0.15)

seamless_pixels = [row[:] for row in colored_pixels]

for y in range(H):
    for x in range(W):
        # Base pixel
        r, g, b = colored_pixels[y][x]
        
        # Horizontal blend
        if x < feather_x:
            # Blend with corresponding point at right edge
            alpha = (1.0 - math.cos(math.pi * x / feather_x)) / 2.0 # 0 at x=0, 1 at x=feather_x
            ox = W - feather_x + x
            or_, og, ob = colored_pixels[y][ox]
            r = int(or_ * (1.0 - alpha) + r * alpha)
            g = int(og * (1.0 - alpha) + g * alpha)
            b = int(ob * (1.0 - alpha) + b * alpha)
        elif x >= W - feather_x:
            alpha = (1.0 - math.cos(math.pi * (W - 1 - x) / feather_x)) / 2.0
            ox = x - (W - feather_x)
            or_, og, ob = colored_pixels[y][ox]
            r = int(or_ * (1.0 - alpha) + r * alpha)
            g = int(og * (1.0 - alpha) + g * alpha)
            b = int(ob * (1.0 - alpha) + b * alpha)

        # Vertical blend
        if y < feather_y:
            alpha = (1.0 - math.cos(math.pi * y / feather_y)) / 2.0
            oy = H - feather_y + y
            or_, og, ob = colored_pixels[oy][x]
            r = int(or_ * (1.0 - alpha) + r * alpha)
            g = int(og * (1.0 - alpha) + g * alpha)
            b = int(ob * (1.0 - alpha) + b * alpha)
        elif y >= H - feather_y:
            alpha = (1.0 - math.cos(math.pi * (H - 1 - y) / feather_y)) / 2.0
            oy = y - (H - feather_y)
            or_, og, ob = colored_pixels[oy][x]
            r = int(or_ * (1.0 - alpha) + r * alpha)
            g = int(og * (1.0 - alpha) + g * alpha)
            b = int(ob * (1.0 - alpha) + b * alpha)

        seamless_pixels[y][x] = (r, g, b)

# Write output BMP
out_bytes = bytearray(bmp_data)
for y in range(height):
    row_idx = offset + y * row_padded
    for x in range(width):
        r, g, b = seamless_pixels[y][x]
        out_bytes[row_idx + x * 3] = b
        out_bytes[row_idx + x * 3 + 1] = g
        out_bytes[row_idx + x * 3 + 2] = r

with open(bmp_out, 'wb') as f:
    f.write(out_bytes)

# Convert to PNG
subprocess.run(['sips', '-s', 'format', 'png', bmp_out, '--out', png_out], check=True)

# Also create SVG wrapper so any svg references continue working seamlessly
import base64
with open(png_out, 'rb') as pf:
    png_b64 = base64.b64encode(pf.read()).decode('utf-8')

svg_content = f'''<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <image width="{width}" height="{height}" href="data:image/png;base64,{png_b64}"/>
</svg>
'''

with open(svg_out, 'w') as sf:
    sf.write(svg_content)

print(f"Successfully generated leopard pattern from reference: {width}x{height}")
