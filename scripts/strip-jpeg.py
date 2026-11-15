"""Copies a picture of the app for the site, dropping every APP1 (Exif, XMP) and comment segment.
Keeps the ICC colour profile (APP2). scripts/check.py refuses a .jpg that still has them.

    python3 -I scripts/strip-jpeg.py <picture.jpg> docs/pictures/<name>.jpg
"""
import sys

def strip(data):
    assert data[:2] == b"\xff\xd8", "not a JPEG"
    out = bytearray(b"\xff\xd8")
    i = 2
    while i < len(data):
        assert data[i] == 0xFF, f"bad marker at {i}"
        marker = data[i + 1]
        if marker == 0xDA:  # start of scan: the rest is image data
            out += data[i:]
            break
        length = int.from_bytes(data[i + 2:i + 4], "big")
        segment = data[i:i + 2 + length]
        if marker not in (0xE1, 0xFE):
            out += segment
        i += 2 + length
    return bytes(out)

src, dest = sys.argv[1], sys.argv[2]
with open(src, "rb") as f:
    data = f.read()
with open(dest, "wb") as f:
    f.write(strip(data))
