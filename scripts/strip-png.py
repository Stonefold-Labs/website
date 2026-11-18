"""Copies a PNG or an .ico of PNGs for the site, keeping only the picture and its colour tag.
Drops every other chunk (Exif, text, dates). scripts/check.py refuses a PNG or ICO that still has them.

    python3 -I scripts/strip-png.py <picture.png|favicon.ico> docs/<name>
"""
import struct
import sys

SIGNATURE = b"\x89PNG\r\n\x1a\n"
KEEP = {b"IHDR", b"PLTE", b"IDAT", b"IEND", b"sRGB", b"gAMA", b"cHRM", b"tRNS"}


def strip_png(data):
    assert data[:8] == SIGNATURE, "not a PNG"
    out = bytearray(SIGNATURE)
    i = 8
    while i < len(data):
        length, = struct.unpack(">I", data[i:i + 4])
        kind = data[i + 4:i + 8]
        if kind in KEEP:
            out += data[i:i + 12 + length]
        i += 12 + length
    return bytes(out)


def strip_ico(data):
    count, = struct.unpack("<H", data[4:6])
    assert data[:4] == b"\x00\x00\x01\x00", "not an .ico"
    entries, images = [], []
    for n in range(count):
        entry = data[6 + 16 * n:22 + 16 * n]
        size, offset = struct.unpack("<II", entry[8:16])
        images.append(strip_png(data[offset:offset + size]))
        entries.append(entry[:8])
    out = bytearray(data[:6])
    offset = 6 + 16 * count
    for entry, image in zip(entries, images):
        out += entry + struct.pack("<II", len(image), offset)
        offset += len(image)
    for image in images:
        out += image
    return bytes(out)


src, dest = sys.argv[1], sys.argv[2]
with open(src, "rb") as f:
    data = f.read()
with open(dest, "wb") as f:
    f.write(strip_ico(data) if src.endswith(".ico") else strip_png(data))
