"""Stonefold Display: a heading font drawn from the wordmark's own letters.

Every glyph is a centerline skeleton (straight runs with rounded corners, as in the wordmark: single stroke weight,
round ends, squared bowls with rounded corners) stroked at the wordmark's weight. Units: the wordmark's drawing x 5,
so the stroke is 115, the x-height 500 and the ascender 700 (outer edges). Run with the venv's python."""
import math
import sys
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

UPM = 1000
W = 115.0
H = W / 2
B, X, A, D = 57.5, 442.5, 642.5, -142.5     # centerlines: baseline, x-height, ascender and cap height, descender
M, C = 250.0, 350.0                          # middle of the x-height, middle of the caps
R = 80.0                                     # the wordmark's corner radius
SB = 50.0                                    # space beside a letter

# ------------------------------------------------------------------ geometry
def unit(dx, dy):
    n = math.hypot(dx, dy)
    return (dx / n, dy / n) if n else (0.0, 0.0)


def fillets(points, radii, closed):
    """For each vertex: None, or (t_in, t_out, center, r, a0, a1)."""
    n = len(points)
    out = []
    for i in range(n):
        r = radii[i]
        if r <= 0 or (not closed and i in (0, n - 1)):
            out.append(None)
            continue
        v = points[i]
        p = points[(i - 1) % n]
        q = points[(i + 1) % n]
        u1 = unit(v[0] - p[0], v[1] - p[1])
        u2 = unit(q[0] - v[0], q[1] - v[1])
        cross = u1[0] * u2[1] - u1[1] * u2[0]
        phi = math.atan2(abs(cross), u1[0] * u2[0] + u1[1] * u2[1])
        if phi < 1e-6:
            out.append(None)
            continue
        t = r * math.tan(phi / 2)
        lim = 0.5 * min(math.hypot(v[0] - p[0], v[1] - p[1]), math.hypot(q[0] - v[0], q[1] - v[1]))
        if t > lim:
            r = r * lim / t
            t = lim
        t1 = (v[0] - u1[0] * t, v[1] - u1[1] * t)
        t2 = (v[0] + u2[0] * t, v[1] + u2[1] * t)
        nrm = (-u1[1], u1[0]) if cross > 0 else (u1[1], -u1[0])
        ctr = (t1[0] + nrm[0] * r, t1[1] + nrm[1] * r)
        a0 = math.atan2(t1[1] - ctr[1], t1[0] - ctr[0])
        a1 = a0 + (phi if cross > 0 else -phi)
        out.append((t1, t2, ctr, r, a0, a1))
    return out


def segments(points, radii, closed):
    """Lines and arcs of the rounded polyline, plus the points that need a round joint (ends and sharp corners)."""
    n = len(points)
    fl = fillets(points, radii, closed)
    segs, joints = [], []
    if n == 1 or (n == 2 and points[0] == points[1]):
        return [], [points[0]]

    def add_line(p, q):
        if math.hypot(q[0] - p[0], q[1] - p[1]) > 1e-6:
            segs.append(("L", p, q))

    if not closed:
        joints += [points[0], points[-1]]
        cur = points[0]
        for i in range(1, n - 1):
            f = fl[i]
            if f:
                add_line(cur, f[0])
                segs.append(("A", f[2], f[3], f[4], f[5]))
                cur = f[1]
            else:
                add_line(cur, points[i])
                joints.append(points[i])
                cur = points[i]
        add_line(cur, points[-1])
    else:
        first = fl[0]
        cur = first[1] if first else points[0]
        for i in range(1, n):
            f = fl[i]
            if f:
                add_line(cur, f[0])
                segs.append(("A", f[2], f[3], f[4], f[5]))
                cur = f[1]
            else:
                add_line(cur, points[i])
                joints.append(points[i])
                cur = points[i]
        add_line(cur, first[0] if first else points[0])
        if first:
            segs.append(("A", first[2], first[3], first[4], first[5]))
        else:
            joints.append(points[0])
    return segs, joints


def arc_cubics(c, rho, a0, a1):
    """Cubic pieces (c1, c2, end) along a circle from a0 to a1, none longer than 90 degrees."""
    sweep = a1 - a0
    k = max(1, int(math.ceil(abs(sweep) / (math.pi / 2) - 1e-9)))
    step = sweep / k
    out = []
    kap = 4.0 / 3.0 * math.tan(step / 4)
    for j in range(k):
        s = a0 + j * step
        e = s + step
        p0 = (c[0] + rho * math.cos(s), c[1] + rho * math.sin(s))
        p3 = (c[0] + rho * math.cos(e), c[1] + rho * math.sin(e))
        c1 = (p0[0] - kap * rho * math.sin(s), p0[1] + kap * rho * math.cos(s))
        c2 = (p3[0] + kap * rho * math.sin(e), p3[1] - kap * rho * math.cos(e))
        out.append((c1, c2, p3))
    return out


def contours_for(segs, joints):
    """Clockwise closed contours (lists of ('M'|'L'|'C', points)) whose union is the stroke."""
    cs = []
    for s in segs:
        if s[0] == "L":
            p, q = s[1], s[2]
            d = unit(q[0] - p[0], q[1] - p[1])
            nx, ny = -d[1] * H, d[0] * H
            cs.append([("M", (p[0] + nx, p[1] + ny)), ("L", (q[0] + nx, q[1] + ny)), ("L", (q[0] - nx, q[1] - ny)), ("L", (p[0] - nx, p[1] - ny))])
        else:
            _, c, r, a0, a1 = s
            ra = r - H if a1 > a0 else r + H
            rb = r + H if a1 > a0 else r - H
            ops = [("M", (c[0] + ra * math.cos(a0), c[1] + ra * math.sin(a0)))]
            for c1, c2, e in arc_cubics(c, ra, a0, a1):
                ops.append(("C", c1, c2, e))
            ops.append(("L", (c[0] + rb * math.cos(a1), c[1] + rb * math.sin(a1))))
            for c1, c2, e in arc_cubics(c, rb, a1, a0):
                ops.append(("C", c1, c2, e))
            cs.append(ops)
    for p in joints:
        ops = [("M", (p[0] + H, p[1]))]
        for c1, c2, e in arc_cubics(p, H, 0.0, -2 * math.pi):
            ops.append(("C", c1, c2, e))
        cs.append(ops)
    return cs


def bounds(contours):
    xs, ys = [], []
    for ops in contours:
        cur = None
        for op in ops:
            if op[0] in "ML":
                cur = op[1]
                xs.append(cur[0]); ys.append(cur[1])
            else:
                c1, c2, e = op[1], op[2], op[3]
                for t in [i / 12 for i in range(1, 13)]:
                    u = 1 - t
                    xs.append(u**3 * cur[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t**3 * e[0])
                    ys.append(u**3 * cur[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t**3 * e[1])
                cur = e
    return min(xs), max(xs), min(ys), max(ys)


def draw(contours, dx, pen):
    for ops in contours:
        for op in ops:
            if op[0] == "M":
                pen.moveTo((op[1][0] + dx, op[1][1]))
            elif op[0] == "L":
                pen.lineTo((op[1][0] + dx, op[1][1]))
            else:
                pen.curveTo((op[1][0] + dx, op[1][1]), (op[2][0] + dx, op[2][1]), (op[3][0] + dx, op[3][1]))
        pen.closePath()


# ------------------------------------------------------------------ the letters
def P(*pts, r=0, closed=False):
    n = len(pts)
    radii = [r] * n if isinstance(r, (int, float)) else list(r)
    return (list(pts), radii, closed)


def dot(x, y):
    return P((x, y), (x, y))


G = {}


def g(chars, *strokes, sb=SB):
    for ch in chars:
        G[ch] = (strokes, sb)


# lowercase
w = 315
g("n", P((0, B), (0, X), (w, X), (w, B), r=[0, 0, R, 0]))
w = 280
g("m", P((0, B), (0, X), (w, X), (w, B), r=[0, 0, R, 0]), P((w, X), (2 * w, X), (2 * w, B), r=[0, R, 0]))
w = 315
g("h", P((0, A), (0, B)), P((0, X), (w, X), (w, B), r=[0, R, 0]))
g("u", P((w, X), (w, B), (0, B), (0, X), r=[0, 0, R, 0]))
g("r", P((0, B), (0, X)), P((0, X), (190, X)))
g("i", P((0, B), (0, X)), dot(0, 615))
g("j", P((0, X), (0, D), (-190, D), r=[0, R, 0]), dot(0, 615))
g("l", P((0, A), (0, B)))
g("t", P((0, 572.5), (0, B), (97, B), r=[0, 76, 0]), P((-77, X), (97, X)))
g("f", P((0, B), (0, A), (87, A), r=[0, 76, 0]), P((-77, X), (87, X)))
w = 305
g("s", P((w, X), (0, X), (0, M), (w, M), (w, B), (0, B), r=[0, R, R, R, R, 0]))
w = 345
g("e", P((0, M), (w, M), (w, X), (0, X), (0, B), (335, B), r=[0, 0, R, R, R, 0]))
w = 385
g("o", P((0, B), (w, B), (w, X), (0, X), r=R, closed=True))
w = 330
g("c", P((w, X), (0, X), (0, B), (w, B), r=[0, R, R, 0]))
w = 345
g("a", P((w, X), (0, X), (0, B), (w, B), r=[0, R, R, 0]), P((w, X), (w, B), (w + 85, B)))
w = 355
g("d", P((w, A), (w, B)), P((w, X), (0, X), (0, B), (w, B), r=[0, R, R, 0]))
g("b", P((0, A), (0, B)), P((0, X), (w, X), (w, B), (0, B), r=[0, R, R, 0]))
g("p", P((0, X), (0, D)), P((0, X), (w, X), (w, B), (0, B), r=[0, R, R, 0]))
g("q", P((w, X), (w, D)), P((w, X), (0, X), (0, B), (w, B), r=[0, R, R, 0]))
g("g", P((w, X), (0, X), (0, B), (w, B), r=[0, R, R, 0]), P((w, X), (w, D), (40, D), r=[0, R, 0]))
w = 300
g("k", P((0, A), (0, B)), P((w, X), (0, 230), (w, B)))
w = 360
g("v", P((0, X), (w / 2, B), (w, X)))
w = 560
g("w", P((0, X), (w / 4, B), (w / 2, X), (3 * w / 4, B), (w, X)))
w = 320
g("x", P((0, X), (w, B)), P((w, X), (0, B)))
w = 340
g("y", P((0, X), (0.474 * w, B)), P((w, X), (0.2 * w, D)))
w = 320
g("z", P((0, X), (w, X), (0, B), (w, B)))

# capitals
w = 440
t = (220 - B) / (A - B)
g("A", P((0, B), (w / 2, A), (w, B)), P((t * w / 2, 220), (w - t * w / 2, 220)))
w = 320
g("B", P((0, A), (0, B)), P((0, A), (w, A), (w, C), (0, C), r=[0, R, R, 0]), P((0, C), (w, C), (w, B), (0, B), r=[0, R, R, 0]))
w = 360
g("C", P((w, A), (0, A), (0, B), (w, B), r=[0, R, R, 0]))
w = 340
g("D", P((0, A), (w, A), (w, B), (0, B), r=[0, R, R, 0]), P((0, A), (0, B)))
w = 300
g("E", P((w, A), (0, A), (0, B), (w, B)), P((0, C), (w * 0.82, C)))
g("F", P((w, A), (0, A), (0, B)), P((0, C), (w * 0.82, C)))
w = 360
g("G", P((w, A), (0, A), (0, B), (w, B), (w, 300), (w * 0.55, 300), r=[0, R, R, R, 0, 0]))
w = 340
g("H", P((0, A), (0, B)), P((w, A), (w, B)), P((0, C), (w, C)))
g("I", P((0, A), (0, B)))
w = 290
g("J", P((w, A), (w, B), (0, B), (0, 220), r=[0, R, R, 0]))
w = 340
g("K", P((0, A), (0, B)), P((w, A), (0, C), (w, B)))
w = 290
g("L", P((0, A), (0, B), (w, B)))
w = 480
g("M", P((0, B), (0, A), (w / 2, 300), (w, A), (w, B)))
w = 360
g("N", P((0, B), (0, A), (w, B), (w, A)))
w = 420
g("O", P((0, B), (w, B), (w, A), (0, A), r=R, closed=True))
g("Q", P((0, B), (w, B), (w, A), (0, A), r=R, closed=True), P((w * 0.55, 200), (w + 25, B - 70)))
w = 320
g("P", P((0, A), (0, B)), P((0, A), (w, A), (w, C), (0, C), r=[0, R, R, 0]))
g("R", P((0, A), (0, B)), P((0, A), (w, A), (w, C), (0, C), r=[0, R, R, 0]), P((w * 0.3, C), (w, B)))
g("S", P((w, A), (0, A), (0, C), (w, C), (w, B), (0, B), r=[0, R, R, R, R, 0]))
w = 360
g("T", P((0, A), (w, A)), P((w / 2, A), (w / 2, B)))
w = 340
g("U", P((0, A), (0, B), (w, B), (w, A), r=[0, R, R, 0]))
w = 420
g("V", P((0, A), (w / 2, B), (w, A)))
w = 640
g("W", P((0, A), (w / 4, B), (w / 2, 420), (3 * w / 4, B), (w, A)))
w = 380
g("X", P((0, A), (w, B)), P((w, A), (0, B)))
w = 400
g("Y", P((0, A), (w / 2, C), (w, A)), P((w / 2, C), (w / 2, B)))
w = 340
g("Z", P((0, A), (w, A), (0, B), (w, B)))

# figures
w = 330
g("0", P((0, B), (w, B), (w, A), (0, A), r=R, closed=True))
g("1", P((0, A), (0, B)), P((-140, 500), (0, A)))
w = 320
g("2", P((0, A), (w, A), (w, C), (0, C), (0, B), (w, B), r=[0, R, R, R, 0, 0]))
g("3", P((0, A), (w, A), (w, C), (w * 0.35, C), r=[0, R, R, 0]), P((w * 0.35, C), (w, C), (w, B), (0, B), r=[0, R, R, 0]))
w = 360
g("4", P((0.72 * w, B), (0.72 * w, A)), P((0.72 * w, A), (0, 230), (w, 230)))
w = 320
g("5", P((w, A), (0, A), (0, C), (w, C), (w, B), (0, B), r=[0, 0, R, R, R, 0]))
g("6", P((w, A), (0, A), (0, B), (w, B), (w, 380), (0, 380), r=[0, R, R, R, R, 0]))
g("7", P((0, A), (w, A), (w * 0.3, B)))
g("8", P((0, C), (w, C), (w, A), (0, A), r=R, closed=True), P((0, B), (w, B), (w, C), (0, C), r=R, closed=True))
g("9", P((0, 300), (w, 300), (w, A), (0, A), r=R, closed=True), P((w, 300), (w, B), (0, B), r=[0, R, 0]))

# punctuation
g(".", dot(0, B), sb=45)
g(",", P((0, B), (-35, -110)), sb=45)
g(":", dot(0, B), dot(0, X), sb=45)
g(";", dot(0, X), P((0, B), (-35, -110)), sb=45)
g("!", P((0, A), (0, 230)), dot(0, B), sb=45)
w = 300
g("?", P((0, 500), (0, A), (w, A), (w, 430), (w * 0.5, 430), (w * 0.5, 250), r=[0, R, R, R, R, 0]), dot(w * 0.5, B))
g("'’", P((0, A), (-22, 470)), sb=45)
g("‘", P((0, A), (22, 470)), sb=45)
g('"”', P((0, A), (-22, 470)), P((150, A), (128, 470)), sb=45)
g("“", P((0, A), (22, 470)), P((150, A), (172, 470)), sb=45)
g("-", P((0, 250), (190, 250)), sb=45)
g("–", P((0, 250), (360, 250)), sb=45)
w = 170
g("([", P((w, A), (0, A), (0, -100), (w, -100), r=[0, R, R, 0]), sb=45)
g(")]", P((0, A), (w, A), (w, -100), (0, -100), r=[0, R, R, 0]), sb=45)
w = 330
g("/", P((0, -60), (w, A + 40)), sb=40)
w = 260
g("+", P((0, 250), (w, 250)), P((w / 2, 120), (w / 2, 380)), sb=45)
g("=", P((0, 195), (w, 195)), P((0, 335), (w, 335)), sb=45)
w = 330
g("%", dot(0, 560), dot(w, 140), P((20, B), (w - 20, 600)), sb=45)
w = 320
g("$", P((w, 560), (0, 560), (0, C), (w, C), (w, 160), (0, 160), r=[0, R, R, R, R, 0]), P((w / 2, A + 20), (w / 2, 560)), P((w / 2, 160), (w / 2, B - 20)))


def build(out_ttf, out_woff2=None):
    glyphs = {}
    metrics = {}
    names = [".notdef", "space"]
    cmap = {32: "space", 160: "space"}
    glyphs["space"] = TTGlyphPen(None).glyph()
    metrics["space"] = (260, 0)
    # .notdef: an open box
    nd_segs, nd_joints = segments([(0, B), (260, B), (260, A), (0, A)], [0, 0, 0, 0], True)
    nd = contours_for(nd_segs, nd_joints)
    x0, x1, _, _ = bounds(nd)
    pen = TTGlyphPen(None)
    draw(nd, SB - x0, Cu2QuPen(pen, 1.0, reverse_direction=False))
    glyphs[".notdef"] = pen.glyph()
    metrics[".notdef"] = (int(round(x1 - x0 + 2 * SB)), int(SB))
    for ch, (strokes, sb) in G.items():
        cons = []
        for pts, radii, closed in strokes:
            segs, joints = segments(pts, radii, closed)
            cons += contours_for(segs, joints)
        x0, x1, _, _ = bounds(cons)
        name = "uni%04X" % ord(ch)
        pen = TTGlyphPen(None)
        draw(cons, sb - x0, Cu2QuPen(pen, 1.0, reverse_direction=False))
        glyphs[name] = pen.glyph()
        metrics[name] = (int(round(x1 - x0 + 2 * sb)), int(round(sb)))
        names.append(name)
        cmap[ord(ch)] = name
    fb = FontBuilder(UPM, isTTF=True)
    fb.setupGlyphOrder(names)
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(glyphs)
    fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=800, descent=-250)
    fb.setupNameTable({"familyName": "Stonefold Display", "styleName": "Regular", "copyright": "Stonefold Labs LLC",
                       "uniqueFontIdentifier": "Stonefold Display 1.0", "version": "Version 1.000"})
    fb.setupOS2(sTypoAscender=800, sTypoDescender=-250, sTypoLineGap=0, usWinAscent=900, usWinDescent=300,
                sxHeight=500, sCapHeight=700, fsType=0, achVendID="STFD")
    fb.setupPost()
    fb.save(out_ttf)
    if out_woff2:
        f = TTFont(out_ttf)
        f.flavor = "woff2"
        f.save(out_woff2)
    return len(names)


if __name__ == "__main__":
    n = build(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
    print("glyphs:", n)
