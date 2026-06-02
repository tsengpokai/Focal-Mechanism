# -*- coding: utf-8 -*-
"""Stable interactive plotting utilities for the Ch4.1 & Ch4.2 Hugging Face Space.

本版重點：
1. 所有圖都輸出為 PNG 檔案路徑，並立即 plt.close(fig)，避免 HF Space 記憶體累積。
2. P 波初動偵探遊戲新增「出題模式」。在「隨機多樣題型」下，seed 不只改變測站位置，也會改變 strike/dip/rake，
   因此會產生低角度逆衝、一般逆斷層、斜逆衝、正斷層、斜正斷層、左移與右移走向滑移等多種海灘球。
"""
import os
import tempfile

# Make Matplotlib cache writable on Hugging Face Spaces.
os.environ.setdefault("MPLCONFIGDIR", tempfile.gettempdir())

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection

plt.rcParams["figure.max_open_warning"] = 0


# ============================================================
# Presets
# ============================================================
PRESETS = {
    "2025 Kamchatka 近似：低角度逆衝": (215, 18, 75),
    "逆衝斷層 thrust：λ = 90°": (0, 45, 90),
    "正斷層 normal：λ = -90°": (0, 45, -90),
    "右移走向滑移 right-lateral：λ = 180°": (0, 90, 180),
    "左移走向滑移 left-lateral：λ = 0°": (0, 90, 0),
    "斜逆衝 oblique reverse：λ = 120°": (20, 45, 120),
    "斜正斷層 oblique normal：λ = -120°": (20, 45, -120),
}

FIRST_MOTION_MODES = [
    "隨機多樣題型（seed 會決定題型）",
    "依手動輸入參數",
    "固定：低角度逆衝斷層",
    "固定：逆斷層／逆衝斷層",
    "固定：斜移斷層：逆衝成分 + 走向滑移成分",
    "固定：正斷層",
    "固定：斜移斷層：正斷成分 + 走向滑移成分",
    "固定：左移走向滑移斷層",
    "固定：右移走向滑移斷層",
]

_RANDOM_CASES = [
    "固定：低角度逆衝斷層",
    "固定：逆斷層／逆衝斷層",
    "固定：斜移斷層：逆衝成分 + 走向滑移成分",
    "固定：正斷層",
    "固定：斜移斷層：正斷成分 + 走向滑移成分",
    "固定：左移走向滑移斷層",
    "固定：右移走向滑移斷層",
]


# ============================================================
# Shared utilities
# ============================================================
def _save_png_and_close(fig, prefix="plot"):
    os.makedirs(tempfile.gettempdir(), exist_ok=True)
    f = tempfile.NamedTemporaryFile(prefix=f"{prefix}_", suffix=".png", delete=False, dir=tempfile.gettempdir())
    path = f.name
    f.close()
    fig.savefig(path, dpi=135, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    return path


def normalize_rake(rake):
    return ((float(rake) + 180.0) % 360.0) - 180.0


def unit(v):
    v = np.asarray(v, dtype=float)
    n = np.linalg.norm(v)
    if n < 1e-12:
        return np.zeros_like(v)
    return v / n


def sdr_vectors(strike, dip, rake):
    """Return strike, down-dip, normal and slip vectors in East-North-Up axes."""
    strike = float(strike) % 360.0
    dip = float(np.clip(dip, 0.0, 90.0))
    rake = normalize_rake(rake)

    s = np.deg2rad(strike)
    d = np.deg2rad(dip)
    r = np.deg2rad(rake)

    strike_vec = np.array([np.sin(s), np.cos(s), 0.0])
    downdip_vec = np.array([np.cos(s) * np.cos(d), -np.sin(s) * np.cos(d), -np.sin(d)])
    normal_vec = unit(np.cross(strike_vec, downdip_vec))

    # Sign convention used here:
    # rake = +90° => reverse/thrust; rake = -90° => normal.
    slip_vec = unit(np.cos(r) * strike_vec - np.sin(r) * downdip_vec)
    return strike_vec, downdip_vec, normal_vec, slip_vec


def sdr_to_vectors(strike, dip, rake):
    _, _, normal, slip = sdr_vectors(strike, dip, rake)
    return normal, slip


def classify_fault_simple(dip, rake):
    r = normalize_rake(rake)
    ss = np.cos(np.deg2rad(r))
    ds = np.sin(np.deg2rad(r))

    if abs(ds) >= 0.85 and abs(ss) < 0.35:
        if ds > 0:
            return "低角度逆衝斷層" if float(dip) < 30 else "逆斷層／逆衝斷層"
        return "正斷層"

    if abs(ss) >= 0.85 and abs(ds) < 0.35:
        return "左移走向滑移斷層" if ss >= 0 else "右移走向滑移斷層"

    if ds > 0:
        return "斜移斷層：逆衝成分 + 走向滑移成分"
    return "斜移斷層：正斷成分 + 走向滑移成分"


def classify_fault_full(dip, rake):
    r = normalize_rake(rake)
    ss = np.cos(np.deg2rad(r))
    ds = np.sin(np.deg2rad(r))
    ss_name = "左移走向滑移" if ss >= 0 else "右移走向滑移"
    ds_name = "逆衝／逆斷層" if ds >= 0 else "正斷層"

    if abs(ds) >= 0.85 and abs(ss) < 0.35:
        if ds > 0:
            if float(dip) < 30:
                return "低角度逆衝斷層（thrust fault）", "rake 接近 +90°，且 dip 小於 30°，代表上盤主要沿低角度斷層面向上滑動，常見於隱沒帶板塊交界面。"
            return "逆斷層／逆衝斷層（reverse/thrust fault）", "rake 接近 +90°，代表上盤主要沿斷層面向上滑動，反映水平擠壓環境。"
        return "正斷層（normal fault）", "rake 接近 -90°，代表上盤主要沿斷層面向下滑動，反映伸張環境。"

    if abs(ss) >= 0.85 and abs(ds) < 0.35:
        return f"{ss_name}斷層（strike-slip fault）", "rake 接近 0° 或 ±180°，代表岩塊主要沿斷層走向水平錯動。"

    if abs(ds) >= abs(ss):
        name = f"斜移斷層：{ds_name}為主，兼具{ss_name}分量"
    else:
        name = f"斜移斷層：{ss_name}為主，兼具{ds_name}分量"
    return name, "rake 介於標準端點之間，代表滑動方向同時包含傾向滑移與走向滑移分量。"


def project_lower(v):
    v = unit(v)
    if np.allclose(v, 0):
        return 0.0, 0.0
    if v[2] > 0:
        v = -v
    theta = np.arccos(np.clip(-v[2], -1.0, 1.0))
    az = np.arctan2(v[0], v[1])
    rho = np.sqrt(2.0) * np.sin(theta / 2.0)
    return float(rho * np.sin(az)), float(rho * np.cos(az))


def moment_tensor(strike, dip, rake):
    normal, slip = sdr_to_vectors(strike, dip, rake)
    return np.outer(slip, normal) + np.outer(normal, slip)


def beachball_grid(M, resolution=241):
    grid = np.linspace(-1.0, 1.0, int(resolution))
    X, Y = np.meshgrid(grid, grid)
    R = np.sqrt(X**2 + Y**2)
    mask = R <= 1.0

    theta = 2.0 * np.arcsin(np.clip(R / np.sqrt(2.0), 0.0, 1.0))
    az = np.arctan2(X, Y)
    rx = np.sin(theta) * np.sin(az)
    ry = np.sin(theta) * np.cos(az)
    rz = -np.cos(theta)

    A = (
        M[0, 0] * rx * rx
        + M[1, 1] * ry * ry
        + M[2, 2] * rz * rz
        + 2.0 * (M[0, 1] * rx * ry + M[0, 2] * rx * rz + M[1, 2] * ry * rz)
    )
    return X, Y, np.where(mask, A, np.nan)


# ============================================================
# Beachball generator
# ============================================================
def make_beachball_image(strike, dip, rake, show_axes=True, resolution=241):
    strike = float(strike) % 360.0
    dip = float(np.clip(dip, 0.0, 90.0))
    rake = normalize_rake(rake)
    normal, slip = sdr_to_vectors(strike, dip, rake)
    M = moment_tensor(strike, dip, rake)
    X, Y, Z = beachball_grid(M, resolution=resolution)

    fig, ax = plt.subplots(figsize=(5.8, 5.8))
    ax.contourf(X, Y, Z, levels=[-1e9, 0, 1e9], colors=["black", "white"], antialiased=True)
    try:
        ax.contour(X, Y, Z, levels=[0], colors=["black"], linewidths=1.7)
    except Exception:
        pass

    ax.add_patch(plt.Circle((0, 0), 1.0, edgecolor="black", facecolor="none", linewidth=2.1))
    for pos, label in [((0, 1.08), "N"), ((1.08, 0), "E"), ((0, -1.08), "S"), ((-1.08, 0), "W")]:
        ax.text(*pos, label, ha="center", va="center", fontsize=12, weight="bold")

    if show_axes:
        p_axis = unit(normal - slip)
        t_axis = unit(normal + slip)
        for label, vec in [("P", p_axis), ("T", t_axis)]:
            px, py = project_lower(vec)
            ax.scatter(px, py, s=78, facecolor="white", edgecolor="black", linewidth=1.2, zorder=10)
            ax.text(px + 0.045, py + 0.045, label, fontsize=11, weight="bold", zorder=11)

    ax.set_title(f"Strike={strike:.0f}°  Dip={dip:.0f}°  Rake={rake:.0f}°", fontsize=12, pad=10)
    ax.set_aspect("equal")
    ax.set_xlim(-1.14, 1.14)
    ax.set_ylim(-1.14, 1.14)
    ax.axis("off")
    fig.tight_layout()
    return _save_png_and_close(fig, "beachball")


def build_bb_explanation(strike, dip, rake):
    strike = float(strike) % 360.0
    dip = float(np.clip(dip, 0.0, 90.0))
    rake = normalize_rake(rake)
    name, desc = classify_fault_full(dip, rake)

    ss = abs(np.cos(np.deg2rad(rake)))
    ds = abs(np.sin(np.deg2rad(rake)))
    total = ss + ds + 1e-9

    if 45 < rake < 135:
        shape = "海灘球通常會呈現逆衝型特徵，常可看到中心區域偏壓縮。"
    elif -135 < rake < -45:
        shape = "海灘球通常會呈現正斷層型特徵，常可看到中心區域偏擴張。"
    elif abs(rake) < 30 or abs(abs(rake) - 180) < 30:
        shape = "海灘球通常接近四象限棋盤狀，代表水平剪切明顯。"
    else:
        shape = "海灘球會呈現歪斜、不完全對稱的斜移型態。"

    if dip < 30:
        dip_note = "此 dip 屬於低角度斷層；若同時為逆衝型，常可聯想到隱沒帶板塊交界面。"
    elif dip > 70:
        dip_note = "此 dip 屬於高角度斷層；若 rake 接近 0° 或 ±180°，常見於走向滑移斷層。"
    else:
        dip_note = "此 dip 屬於中等傾角斷層，需要搭配 rake 判斷主要錯動型態。"

    return f"""
## 判讀結果：{name}

| 參數 | 數值 | 意義 |
|---|---:|---|
| Strike | **{strike:.1f}°** | 斷層在地圖上的延伸方向 |
| Dip | **{dip:.1f}°** | 斷層面往地下傾斜的角度 |
| Rake | **{rake:.1f}°** | 上盤相對下盤的滑動方向 |

{desc}  
{dip_note}

| 分量 | 約略比例 |
|---|---:|
| 走向滑移 | **{ss / total * 100:.0f}%** |
| 傾向滑移 | **{ds / total * 100:.0f}%** |

{shape}

**讀圖提醒：**黑色代表 P 波壓縮象限，白色代表 P 波擴張象限；黑白交界線是兩個節面，其中一個是真正斷層面，另一個是輔助面。
"""


def bb_update(strike, dip, rake, show_axes=True):
    return make_beachball_image(strike, dip, rake, show_axes), build_bb_explanation(strike, dip, rake)


def bb_preset(preset_name, show_axes=True):
    s, d, r = PRESETS.get(preset_name, PRESETS["2025 Kamchatka 近似：低角度逆衝"])
    img, text = bb_update(s, d, r, show_axes)
    return s, d, r, img, text


# ============================================================
# 3D fault geometry
# ============================================================
def compass_text(angle):
    a = float(angle) % 360
    dirs = [(0, "北"), (45, "東北"), (90, "東"), (135, "東南"), (180, "南"), (225, "西南"), (270, "西"), (315, "西北"), (360, "北")]
    return min(dirs, key=lambda item: abs(item[0] - a))[1]


def plot_fault_geometry(strike, dip, rake, view_elev, view_azim, show_vectors=True):
    strike = float(strike) % 360.0
    dip = float(np.clip(dip, 0.0, 90.0))
    rake = normalize_rake(rake)
    sv, ddv, nv, slip = sdr_vectors(strike, dip, rake)

    L, W = 4.0, 3.0
    center = np.array([0.0, 0.0, 0.0])
    p1 = center - L * sv / 2
    p2 = center + L * sv / 2
    p3 = center + L * sv / 2 + W * ddv
    p4 = center - L * sv / 2 + W * ddv
    ground = [np.array([-3.5, -3.5, 0.0]), np.array([3.5, -3.5, 0.0]), np.array([3.5, 3.5, 0.0]), np.array([-3.5, 3.5, 0.0])]

    fig = plt.figure(figsize=(7.0, 6.1))
    ax = fig.add_subplot(111, projection="3d")
    ax.add_collection3d(Poly3DCollection([ground], alpha=0.10, edgecolor="black"))
    ax.add_collection3d(Poly3DCollection([[p1, p2, p3, p4]], alpha=0.45, edgecolor="black", linewidth=1.4))
    ax.quiver(0, 0, 0.05, 0, 1.4, 0, arrow_length_ratio=0.16, linewidth=2)
    ax.text(0, 3.4, 0.12, "North", fontsize=10)

    if show_vectors:
        vectors = [(sv, "Strike", 1.8, 2.0, 3), (ddv, "Down-dip", 1.4, 1.6, 3), (slip, "Slip/Rake", 1.9, 2.1, 4), (nv, "Normal", 1.35, 1.55, 2)]
        for vec, label, length, text_scale, lw in vectors:
            ax.quiver(0, 0, 0, vec[0], vec[1], vec[2], length=length, arrow_length_ratio=0.16, linewidth=lw)
            ax.text(*(vec * text_scale), label, fontsize=10)

    ax.set_xlabel("East")
    ax.set_ylabel("North")
    ax.set_zlabel("Up")
    ax.set_xlim(-4, 4)
    ax.set_ylim(-4, 4)
    ax.set_zlim(-4, 2.2)
    ax.view_init(elev=float(view_elev), azim=float(view_azim))
    ax.set_title(f"3D Fault Geometry: Strike={strike:.0f}°, Dip={dip:.0f}°, Rake={rake:.0f}°", pad=14)
    fig.tight_layout()

    img = _save_png_and_close(fig, "fault3d")
    ft = classify_fault_simple(dip, rake)
    ss = abs(np.cos(np.deg2rad(rake)))
    ds = abs(np.sin(np.deg2rad(rake)))
    total = ss + ds + 1e-9
    md = f"""
## 判讀結果：{ft}

| 參數 | 數值 | 簡單說法 |
|---|---:|---|
| Strike | {strike:.1f}° | 斷層朝 **{compass_text(strike)}** 方向延伸 |
| Dip | {dip:.1f}° | 斷層面傾斜角度 |
| Rake | {rake:.1f}° | 上盤滑動方向 |

| 分量 | 比例 |
|---|---:|
| 走向滑移 | {ss / total * 100:.0f}% |
| 傾向滑移 | {ds / total * 100:.0f}% |

這張 3D 圖的重點是：strike 控制斷層在地圖上的方向，dip 控制斷層傾斜多陡，rake 控制岩塊沿斷層面往哪裡滑。
"""
    return img, md


# ============================================================
# P-wave first motion detective game
# ============================================================
def _sample_mechanism_by_case(case_name, seed):
    """Return strike, dip, rake, target label from a case name."""
    rng = np.random.default_rng(int(seed) + 24680)
    strike = float(rng.uniform(0, 360))

    if case_name == "固定：低角度逆衝斷層":
        dip = float(rng.uniform(12, 27))
        rake = float(rng.uniform(72, 106))

    elif case_name == "固定：逆斷層／逆衝斷層":
        dip = float(rng.uniform(38, 68))
        rake = float(rng.uniform(74, 108))

    elif case_name == "固定：斜移斷層：逆衝成分 + 走向滑移成分":
        dip = float(rng.uniform(32, 74))
        # Avoid pure reverse; keep clear oblique reverse.
        rake = float(rng.choice([rng.uniform(32, 63), rng.uniform(117, 148)]))

    elif case_name == "固定：正斷層":
        dip = float(rng.uniform(38, 74))
        rake = float(rng.uniform(-108, -74))

    elif case_name == "固定：斜移斷層：正斷成分 + 走向滑移成分":
        dip = float(rng.uniform(32, 76))
        # Avoid pure normal; keep clear oblique normal.
        rake = float(rng.choice([rng.uniform(-63, -32), rng.uniform(-148, -117)]))

    elif case_name == "固定：左移走向滑移斷層":
        dip = float(rng.uniform(78, 90))
        rake = float(rng.uniform(-14, 14))

    elif case_name == "固定：右移走向滑移斷層":
        dip = float(rng.uniform(78, 90))
        rake = float(rng.choice([rng.uniform(166, 179), rng.uniform(-179, -166)]))

    else:
        # Fallback: manual-looking low-angle reverse
        dip = float(rng.uniform(12, 27))
        rake = float(rng.uniform(72, 106))

    return strike, dip, normalize_rake(rake), case_name.replace("固定：", "")


def _resolve_first_motion_mechanism(strike, dip, rake, seed, question_mode):
    """Choose the actual mechanism used in first-motion game."""
    question_mode = question_mode or "依手動輸入參數"
    seed = int(seed)

    if question_mode == "依手動輸入參數":
        strike = float(strike) % 360.0
        dip = float(np.clip(dip, 0.0, 90.0))
        rake = normalize_rake(rake)
        return strike, dip, rake, "依手動輸入參數"

    if question_mode == "隨機多樣題型（seed 會決定題型）":
        case_name = _RANDOM_CASES[seed % len(_RANDOM_CASES)]
        return _sample_mechanism_by_case(case_name, seed)

    return _sample_mechanism_by_case(question_mode, seed)


def first_motion_game(strike, dip, rake, nstations, seed, show_answer, guess, question_mode="隨機多樣題型（seed 會決定題型）"):
    actual_strike, actual_dip, actual_rake, source_label = _resolve_first_motion_mechanism(
        strike, dip, rake, seed, question_mode
    )

    nstations = int(np.clip(int(nstations), 8, 80))
    seed = int(seed)
    M = moment_tensor(actual_strike, actual_dip, actual_rake)

    # Station distribution uses a separate RNG stream.  This lets the same seed define both
    # the mechanism and the station geometry, but without making their random numbers interfere.
    rng = np.random.default_rng(seed + 100000)

    # Give stations broad azimuthal coverage, plus random jitter.
    azimuths = np.linspace(0, 360, nstations, endpoint=False)
    azimuths = (azimuths + rng.normal(0, 360 / nstations * 0.30, nstations)) % 360

    # Mix near-center and near-edge points so nodal planes are easier to infer.
    n_inner = int(nstations * 0.45)
    n_outer = nstations - n_inner
    takeoffs = np.concatenate([
        rng.uniform(12, 42, n_inner),
        rng.uniform(43, 84, n_outer),
    ])
    rng.shuffle(takeoffs)

    xs, ys, colors, labels = [], [], [], []
    for az, to in zip(azimuths, takeoffs):
        th = np.deg2rad(to)
        azr = np.deg2rad(az)
        rvec = np.array([np.sin(th) * np.sin(azr), np.sin(th) * np.cos(azr), -np.cos(th)])
        amp = float(rvec.T @ M @ rvec)
        x, y = project_lower(rvec)
        xs.append(x)
        ys.append(y)
        colors.append("black" if amp < 0 else "white")
        labels.append("C" if amp < 0 else "D")

    fig, ax = plt.subplots(figsize=(5.9, 5.9))
    if bool(show_answer):
        X, Y, Z = beachball_grid(M, resolution=221)
        ax.contourf(X, Y, Z, levels=[-1e9, 0, 1e9], colors=["black", "white"], alpha=0.55)
        try:
            ax.contour(X, Y, Z, levels=[0], colors=["black"], linewidths=1.8)
        except Exception:
            pass

    ax.add_patch(plt.Circle((0, 0), 1.0, edgecolor="black", facecolor="none", linewidth=2.1))
    for x, y, c, lab in zip(xs, ys, colors, labels):
        ax.scatter(x, y, s=80, facecolor=c, edgecolor="black", linewidth=1.15, zorder=5)
        ax.text(x, y - 0.045, lab, ha="center", va="top", fontsize=8, color="gray", zorder=6)

    for pos, label in [((0, 1.08), "N"), ((1.08, 0), "E"), ((0, -1.08), "S"), ((-1.08, 0), "W")]:
        ax.text(*pos, label, ha="center", va="center", fontsize=12, weight="bold")

    ax.set_title("P-wave First Motions" if not show_answer else "P-wave First Motions + Answer", fontsize=12)
    ax.set_aspect("equal")
    ax.set_xlim(-1.14, 1.14)
    ax.set_ylim(-1.14, 1.14)
    ax.axis("off")
    fig.tight_layout()

    img = _save_png_and_close(fig, "firstmotion")
    answer = classify_fault_simple(actual_dip, actual_rake)

    if guess == "先不猜":
        fb = "先觀察測站點：黑點 C 是壓縮初動，白點 D 是擴張初動。"
    elif guess == answer:
        fb = f"答對了！這組震源機制最接近：**{answer}**。"
    else:
        fb = f"目前答案不對。你猜 **{guess}**，正確較接近 **{answer}**。"

    if question_mode == "依手動輸入參數":
        mode_note = "本題使用左側手動輸入的 Strike、Dip、Rake。"
    else:
        mode_note = f"本題由 **{question_mode}** 產生；seed = **{seed}**，實際題型為 **{source_label}**。"

    if show_answer:
        block = f"""
### 正解

| 參數 | 數值 |
|---|---:|
| Strike | {actual_strike:.1f}° |
| Dip | {actual_dip:.1f}° |
| Rake | {actual_rake:.1f}° |
| 斷層型態 | {answer} |

黑白交界線就是兩個節面；其中一條是斷層面，另一條是輔助面。
"""
    else:
        block = """
### 挑戰模式

目前沒有顯示完整海灘球。請先只看黑白測站點分布，想像哪兩條節面能把壓縮與擴張分開。  
需要核對答案時，再勾選「顯示正解海灘球」。
"""

    seed_hint = """
### 多樣化 seed 提示

在「隨機多樣題型」模式下，seed 會輪流抽出不同斷層型態：

| Seed 範例 | 會出現的主要題型 |
|---:|---|
| 42 | 低角度逆衝斷層 |
| 43 | 逆斷層／逆衝斷層 |
| 44 | 斜移斷層：逆衝成分 + 走向滑移成分 |
| 45 | 正斷層 |
| 46 | 斜移斷層：正斷成分 + 走向滑移成分 |
| 47 | 左移走向滑移斷層 |
| 48 | 右移走向滑移斷層 |
"""

    return img, f"## 偵探判讀\n{fb}\n\n{mode_note}\n\n{block}\n\n{seed_hint}"
