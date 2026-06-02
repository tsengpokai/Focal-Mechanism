
// P 波初動震源機制解互動 Demo
// Vanilla JS only: suitable for GitHub Pages.

const P25_SAMPLE_CSV = `station,distance_km,azimuth_deg,takeoff_deg,polarity,predicted_polarity,amplitude_sign_value,fit
TWC,15.8,248.0,167.0,+,+,0.2010999140399746,True
ESA,18.9,239.0,164.0,+,+,0.25429632863008633,True
TUIB,20.6,348.0,157.0,+,+,0.011384182761904893,True
EGS,20.9,349.0,156.0,+,+,0.008431209112697846,True
ILA,27.5,303.0,145.0,+,+,0.5017130609270102,True
NTC,27.6,329.0,145.0,+,+,0.23636251607317618,True
NDS,29.3,264.0,156.0,+,+,0.5351756780436642,True
EWT,33.2,219.0,148.0,+,+,0.45278875215730663,True
TWE,33.2,289.0,142.0,+,+,0.6607448878742128,True
EOS2,35.6,139.0,139.0,-,-,-0.8868979272171926,True
ENA,36.8,217.0,140.0,+,+,0.5534267579194165,True
TWB1,38.2,354.0,145.0,+,+,0.004974027333935288,True
TIPB,38.9,331.0,132.0,+,+,0.1926343132213456,True
FUSB,43.7,293.0,131.0,+,+,0.6359245630844574,True
NSG,43.7,331.0,131.0,+,+,0.18664168443295864,True
ENT,43.8,270.0,141.0,+,+,0.8148592938674063,True
EAH,45.6,207.0,129.0,+,+,0.4812434449198826,True
SXI1,49.7,334.0,123.0,+,+,0.09764168445388699,True
NDT,50.3,270.0,127.0,+,+,0.8904281540955828,True
LATB,50.5,246.0,128.0,+,+,0.9844150537803287,True
WFSB,50.7,333.0,132.0,+,+,0.17432100912261295,True
A124,51.0,304.0,127.0,+,+,0.46080202231832956,True
EOS3,52.5,143.0,125.0,-,-,-0.8768553891051873,True
TWA,54.6,317.0,126.0,+,+,0.2868687195057038,True
NHDH,58.8,311.0,124.0,+,+,0.3354447683728673,True
NOU,58.9,336.0,128.0,+,+,0.12461658575481543,True
NXZ,59.0,321.0,123.0,+,+,0.20803192577419144,True
DYSB,63.4,292.0,123.0,+,+,0.5860992990397585,True
YHNB,63.8,271.0,108.0,+,+,0.6571709483651497,True
NSK,64.7,271.0,108.0,+,+,0.6571709483651497,True
TAP,64.9,318.0,117.0,+,+,0.15172278820773222,True
NNS,67.9,242.0,121.0,+,+,0.9906147104352337,True
EOS4,68.0,160.0,115.0,-,-,-0.5773655443246251,True
NACB,68.1,209.0,116.0,+,+,0.5797954298475138,True
NNSB,68.2,241.0,121.0,+,+,0.9872865684004433,True
YM01,69.5,320.0,120.0,+,+,0.17777070588180943,True
NSX,71.0,302.0,120.0,+,+,0.4001317336431642,True
YM08,71.9,324.0,119.0,+,+,0.12598467547192543,True
ZUZH,72.5,319.0,119.0,+,+,0.17310936518565018,True
ETLH,73.1,234.0,115.0,+,+,0.9364553255620623,True
ANP,75.2,320.0,118.0,+,+,0.14781473341976703,True
TWD,76.0,224.0,99.0,+,+,0.706446332996146,True
TWS1,76.5,318.0,110.0,+,+,0.02493092654372525,True
B011,76.9,293.0,122.0,+,+,0.5593701441826514,True
TWY,78.7,329.0,113.0,+,+,0.0016611433805120979,True
NTS,79.2,321.0,113.0,+,+,0.05548401258679647,True
NTY,80.9,299.0,125.0,+,+,0.5086778854097391,True
KSHI,85.1,273.0,116.0,+,+,0.7674472996743523,True
HWA,85.7,197.0,101.0,+,+,0.2974878719984902,True
HWLB,85.8,197.0,101.0,+,+,0.2974878719984902,True
NCU,89.6,292.0,103.0,+,+,0.19673664100997368,True
FUSS,89.8,234.0,116.0,+,+,0.9404085215129692,True
NCUH,89.8,292.0,102.0,+,+,0.17079375835710922,True
NFF,90.0,273.0,115.0,+,+,0.7530286876557959,True
GWUB,92.1,266.0,112.0,+,+,0.7971267191690417,True
ETM,92.9,214.0,95.0,+,+,0.5487403089195939,True
NJD,93.3,275.0,98.0,+,+,0.3514261269614023,True
EYL,93.4,197.0,103.0,+,+,0.30238932750536646,True
WHF,93.9,227.0,115.0,+,+,0.8737960335264757,True
TWT,96.9,234.0,106.0,+,+,0.8618188822152223,True
TDCB,97.1,234.0,106.0,+,+,0.8618188822152223,True
LIOB,100.3,268.0,94.0,+,+,0.3561326295084648,True
NST,101.1,267.0,94.0,+,+,0.37214218471240673,True
SBCB,104.4,277.0,94.0,+,+,0.20427923013203278,True
SHUL,106.7,198.0,104.0,+,+,0.32653885531562254,True
ESL,110.0,219.0,101.0,+,+,0.6794352205078595,True
H176,110.1,269.0,95.0,+,+,0.3681312874769583,True
OWD,114.9,219.0,100.0,+,+,0.6684261118018424,True
WHP,115.6,247.0,90.0,+,+,0.5155779948887196,True
WUSB,116.7,230.0,99.0,+,+,0.7456020072731842,True
NML,120.1,273.0,97.0,+,+,0.35768641152380115,True
F033,120.4,206.0,87.0,+,+,0.3533136802426852,True
WARB,121.9,219.0,100.0,+,+,0.6684261118018424,True
NMLH,123.9,263.0,87.0,+,+,0.2310953223264024,True
EGFH,124.5,217.0,96.0,+,+,0.5969944489003791,True
JIGB,127.8,227.0,105.0,+,+,0.8055808980369294,True
NSY,128.3,256.0,84.0,+,+,0.24458708595324466,True
WPL,128.4,228.0,99.0,+,+,0.7350943657864654,True
TWQ1,129.0,254.0,87.0,+,+,0.3585151782148104,True
WCS,129.6,247.0,91.0,+,+,0.5415834437801261,True
DPDB,129.7,250.0,87.0,+,+,0.4051124990952108,True
SML,140.9,231.0,97.0,+,+,0.7161859059610751,True
HGSD,142.3,213.0,93.0,+,+,0.5118501961034546,True
TYC,142.5,227.0,98.0,+,+,0.7137571398737821,True
SSLB,144.0,232.0,100.0,+,+,0.7697359454779882,True
EHY,145.3,208.0,92.0,+,+,0.43482114665377464,True
EHYH,145.6,208.0,92.0,+,+,0.43482114665377464,True
YULB,157.8,207.0,89.0,+,+,0.38851594536684186,True
WNT1,158.4,248.0,81.0,+,+,0.25602750984921263,True
WHY,158.5,235.0,89.0,+,+,0.5551088014431773,True
WNT,159.1,247.0,79.0,+,+,0.20942559014478895,True
ECB,159.2,211.0,85.0,+,+,0.38150771630493263,True
EYUL,161.3,205.0,88.0,+,+,0.35156331505428823,True
TWF1,161.6,206.0,89.0,+,+,0.3754212328093236,True
YUS,167.9,210.0,88.0,+,+,0.41256984224779325,True
ALS,176.0,233.0,80.0,+,+,0.3423023641440702,True
FULB,177.3,205.0,82.0,+,+,0.2833009383157232,True
WGK,181.5,243.0,78.0,+,+,0.22167142627337955,True
CHK,184.6,193.0,90.0,+,+,0.18232425306478356,True
WRL,185.4,251.0,83.0,+,+,0.2794813799799882,True
EHD,186.1,206.0,88.0,+,+,0.3645222756203099,True
RLNB,187.7,242.0,86.0,+,+,0.44897636897874493,True
ECS,190.9,205.0,84.0,+,+,0.3070844141983291,True
ELD,191.2,205.0,92.0,+,+,0.39121196623439086,True
WCKO,196.5,233.0,85.0,+,+,0.46514535663683,True
EDH,200.1,201.0,81.0,+,+,0.23095705410926312,True
CHN4,204.0,235.0,78.0,+,+,0.2816794017664182,True
TPUB,205.6,233.0,75.0,+,+,0.2153621508708229,True
STYH,205.9,208.0,83.0,+,+,0.325323135838778,True
STY,208.6,208.0,83.0,+,+,0.325323135838778,True
WTP,210.7,231.0,75.0,+,+,0.22540586453306455,True
LONT,213.7,198.0,88.0,+,+,0.25214393415720104,True
CHN1,222.0,234.0,75.0,+,+,0.20963493972419284,True
TWGB,224.8,198.0,88.0,+,+,0.25214393415720104,True
TWG,224.8,198.0,88.0,+,+,0.25214393415720104,True
SGS,226.6,229.0,74.0,+,+,0.20930005615770753,True
ICHU,227.1,228.0,73.0,+,+,0.1890928413569854,True
SLG,230.7,208.0,83.0,+,+,0.325323135838778,True
SSH,243.0,235.0,74.0,+,+,0.1773255822632258,True
SHH,247.9,232.0,73.0,+,+,0.17015955825553836,True
SCS,249.7,228.0,72.0,+,+,0.16518928913247938,True
TAI1,254.4,234.0,72.0,+,+,0.13225042134507758,True
SMG,257.1,213.0,66.0,+,+,0.0743541434477692,True
VWUC,261.7,278.0,80.0,-,-,-0.23027866041631434,True
SGL,263.8,217.0,71.0,+,+,0.16553758345869324,True
D009,266.2,232.0,75.0,+,+,0.22061970750433663,True
MATB,266.3,309.0,80.0,-,-,-0.6013064427035908,True
MASB,266.6,213.0,67.0,+,+,0.09186605570487355,True
SPT,268.2,215.0,66.0,+,+,0.07205865118578969,True
KAUH,274.6,230.0,74.0,+,+,0.20512262107995893,True
PHUB,277.7,240.0,75.0,-,+,0.16558952964458817,False
TAWH,281.1,200.0,90.0,+,+,0.29733133389165556,True
SSP,282.1,211.0,68.0,+,+,0.10865765766895591,True
D106,284.0,218.0,68.0,+,+,0.10561868985410366,True
WSS,285.6,217.0,68.0,+,+,0.10708172683319878,True
SCZ,289.9,209.0,67.0,+,+,0.09095687489245377,True
LYUB,293.7,184.0,86.0,+,+,0.02914139656757888,True
LAY,294.1,183.0,86.0,+,+,0.014075356407200534,True
PTMZ,295.6,277.0,76.0,-,-,-0.3297380157112254,True
SLIU,297.3,206.0,67.0,+,+,0.08730860628707551,True
WLCH,304.8,214.0,67.0,+,+,0.09132471774477019,True
LYJJ,308.3,314.0,77.0,-,-,-0.6769997367821141,True
XPSS,310.8,325.0,79.0,-,-,-0.6122789033498567,True
SMS,315.7,203.0,73.0,+,+,0.15656225633003995,True
TWKB,324.8,202.0,76.0,+,+,0.18584238222654742,True
SEB,327.4,201.0,78.0,+,+,0.1997861505717073,True
JMJ,333.9,98.0,80.0,-,+,0.35436942618908723,False
MHZQ,340.0,299.0,74.0,-,-,-0.6691357787524208,True
EOSA,354.3,208.0,71.0,+,+,0.15078922749322282,True
AXDP,410.4,271.0,70.0,-,-,-0.39976773936590476,True
ZPLA,440.5,254.0,70.0,-,-,-0.13913607816702872,True
DSXP,477.8,251.0,70.0,-,-,-0.09793255395188943,True
SXFK,480.3,295.0,69.0,-,-,-0.7413579326981267,True
JOW,674.2,73.0,70.0,+,+,0.8901699270338342,True
`;

const KNOWN_SOLUTION = { strike: 102, dip: 30, rake: -11 };
const R = Math.PI / 180;
const D = 180 / Math.PI;

let picks = [];
let currentGame = null;
let gameCorrect = 0;
let gameTotal = 0;

const $ = (id) => document.getElementById(id);

function deg2rad(v) { return v * R; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function norm360(v) { return ((v % 360) + 360) % 360; }
function normRake(v) {
  let r = ((Number(v) + 180) % 360 + 360) % 360 - 180;
  return r === -180 ? 180 : r;
}

function correctTakeoff(azimuth, takeoff) {
  let az = Number(azimuth);
  let take = Number(takeoff);
  let flipped = false;
  if (take > 90) {
    take = 180 - take;
    az = az - 180;
    flipped = true;
  }
  return { azimuth: norm360(az), takeoff: take, flipped };
}

function vectorFromAzTake(azimuth, takeoff) {
  const a = deg2rad(azimuth);
  const t = deg2rad(takeoff);
  return {
    E: Math.sin(t) * Math.sin(a),
    N: Math.sin(t) * Math.cos(a),
    U: -Math.cos(t)
  };
}

function projectAzTake(azimuth, takeoff, radius, cx, cy) {
  const a = deg2rad(azimuth);
  const t = deg2rad(takeoff);
  const rho = Math.SQRT2 * Math.sin(t / 2);
  const x = rho * Math.sin(a);
  const y = rho * Math.cos(a);
  return { x: cx + x * radius, y: cy - y * radius, rho };
}

function parseInput(text) {
  const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const out = [];
  for (const line of lines) {
    if (/^station\s*,/i.test(line)) continue;

    let station, distance, azimuth, takeoff, polarity;

    if (line.includes(',')) {
      const parts = line.split(',').map(s => s.trim());
      station = parts[0];
      distance = parseFloat(parts[1]);
      azimuth = parseFloat(parts[2]);
      takeoff = parseFloat(parts[3]);
      polarity = (parts[4] || '').trim()[0];
    } else {
      const m = line.match(/^([A-Za-z0-9]+)\s+([0-9.]+)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)([+\-]?)/);
      if (!m) continue;
      station = m[1];
      distance = parseFloat(m[2]);
      azimuth = parseFloat(m[3]);
      takeoff = parseFloat(m[4]);
      polarity = m[5] || '';
    }

    if (!station || !Number.isFinite(azimuth) || !Number.isFinite(takeoff)) continue;
    if (polarity !== '+' && polarity !== '-') continue;

    const corrected = correctTakeoff(azimuth, takeoff);
    const v = vectorFromAzTake(corrected.azimuth, corrected.takeoff);
    out.push({
      station, distance, azimuth, takeoff, polarity,
      cazimuth: corrected.azimuth,
      ctakeoff: corrected.takeoff,
      flipped: corrected.flipped,
      vector: v,
      prediction: '',
      fit: null,
      amp: null
    });
  }
  return out;
}

function momentComponents(strike, dip, rake) {
  const ph = deg2rad(strike);
  const de = deg2rad(dip);
  const la = deg2rad(rake);
  const sp = Math.sin(ph), cp = Math.cos(ph);
  const sd = Math.sin(de), cd = Math.cos(de);
  const cl = Math.cos(la), sl = Math.sin(la);

  const stE = sp, stN = cp, stU = 0;
  const ddE = cp * cd, ddN = -sp * cd, ddU = -sd;
  const nE = -cp * sd, nN = sp * sd, nU = -cd;
  const sE = cl * stE + sl * ddE;
  const sN = cl * stN + sl * ddN;
  const sU = cl * stU + sl * ddU;

  return [
    2 * sE * nE,
    2 * sN * nN,
    2 * sU * nU,
    sE * nN + nE * sN,
    sE * nU + nE * sU,
    sN * nU + nN * sU
  ];
}

function amplitude(v, M) {
  return M[0] * v.E * v.E + M[1] * v.N * v.N + M[2] * v.U * v.U +
         2 * M[3] * v.E * v.N + 2 * M[4] * v.E * v.U + 2 * M[5] * v.N * v.U;
}

function scorePicks(data, strike, dip, rake, keepDetails = false) {
  const M = momentComponents(strike, dip, rake);
  let fit = 0;
  let margin = 0;
  const detail = [];
  for (const p of data) {
    const a = amplitude(p.vector, M);
    const pred = a >= 0 ? '+' : '-';
    const ok = pred === p.polarity;
    if (ok) fit++;
    margin += Math.abs(a);
    if (keepDetails) detail.push({ station: p.station, amp: a, pred, fit: ok });
  }
  return { fit, total: data.length, ratio: data.length ? fit / data.length : 0, margin: margin / Math.max(1, data.length), detail };
}

function classifyFault(dip, rake) {
  const r = normRake(rake);
  const ss = Math.cos(deg2rad(r));
  const ds = Math.sin(deg2rad(r));
  if (Math.abs(ds) >= 0.85 && Math.abs(ss) < 0.35) {
    if (ds > 0) return dip < 30 ? '低角度逆衝斷層' : '逆斷層／逆衝斷層';
    return '正斷層';
  }
  if (Math.abs(ss) >= 0.85 && Math.abs(ds) < 0.35) {
    return ss >= 0 ? '左移走向滑移斷層' : '右移走向滑移斷層';
  }
  return ds > 0 ? '斜移斷層：逆衝成分 + 走向滑移成分' : '斜移斷層：正斷成分 + 走向滑移成分';
}

function explainMechanism(strike, dip, rake) {
  const type = classifyFault(dip, rake);
  const ss = Math.abs(Math.cos(deg2rad(rake)));
  const ds = Math.abs(Math.sin(deg2rad(rake)));
  const total = ss + ds || 1;
  return `${type}。Strike=${Math.round(strike)}°，Dip=${Math.round(dip)}°，Rake=${Math.round(rake)}°。` +
         `約 ${Math.round(ss / total * 100)}% 走向滑移、${Math.round(ds / total * 100)}% 傾向滑移。`;
}

function inverseEqualArea(x, y) {
  const rho2 = x * x + y * y;
  const U = rho2 - 1;
  const rho = Math.sqrt(rho2);
  const h = Math.sqrt(Math.max(0, 1 - U * U));
  let E = 0, N = 0;
  if (rho > 1e-12) {
    E = x / rho * h;
    N = y / rho * h;
  }
  return { E, N, U };
}

function drawSphere(canvas, data, strike, dip, rake, options = {}) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const radius = Math.min(W, H) * 0.41;
  const M = momentComponents(strike, dip, rake);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fffdf8';
  ctx.fillRect(0, 0, W, H);

  if (options.showBeachball) {
    const img = ctx.createImageData(W, H);
    const pix = img.data;
    for (let py = 0; py < H; py += 1) {
      for (let px = 0; px < W; px += 1) {
        const x = (px - cx) / radius;
        const y = (cy - py) / radius;
        const idx = (py * W + px) * 4;
        if (x * x + y * y <= 1) {
          const v = inverseEqualArea(x, y);
          const a = amplitude(v, M);
          let c = a >= 0 ? 224 : 255;
          pix[idx] = c; pix[idx + 1] = c; pix[idx + 2] = c; pix[idx + 3] = 255;
        } else {
          pix[idx] = 255; pix[idx + 1] = 253; pix[idx + 2] = 248; pix[idx + 3] = 255;
        }
      }
    }
    ctx.putImageData(img, 0, 0);

    // Approximate nodal boundary by drawing small dark pixels near amplitude zero.
    ctx.save();
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1.1;
    for (let py = 3; py < H - 3; py += 3) {
      for (let px = 3; px < W - 3; px += 3) {
        const x = (px - cx) / radius;
        const y = (cy - py) / radius;
        if (x * x + y * y > 1) continue;
        const a = amplitude(inverseEqualArea(x, y), M);
        const ax = amplitude(inverseEqualArea((px + 3 - cx) / radius, y), M);
        const ay = amplitude(inverseEqualArea(x, (cy - (py + 3)) / radius), M);
        if ((a >= 0) !== (ax >= 0) || (a >= 0) !== (ay >= 0)) {
          ctx.beginPath();
          ctx.arc(px, py, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = '#111';
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#111';
  ctx.stroke();

  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillStyle = '#111';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('N', cx, cy - radius - 30);
  ctx.fillText('E', cx + radius + 30, cy);
  ctx.fillText('S', cx, cy + radius + 30);
  ctx.fillText('W', cx - radius - 30, cy);
  ctx.restore();

  const details = scorePicks(data, strike, dip, rake, true).detail;
  const detailByStation = new Map(details.map(d => [d.station, d]));

  for (const p of data) {
    const pos = projectAzTake(p.cazimuth, p.ctakeoff, radius, cx, cy);
    const det = detailByStation.get(p.station);
    const isPlus = p.polarity === '+';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, isPlus ? 6.8 : 8, 0, Math.PI * 2);
    ctx.fillStyle = isPlus ? '#111' : '#fff';
    ctx.strokeStyle = '#111';
    ctx.lineWidth = isPlus ? 1 : 2;
    ctx.fill();
    ctx.stroke();

    if (options.showMisfit && det && !det.fit) {
      ctx.save();
      ctx.strokeStyle = '#c30010';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(pos.x - 11, pos.y - 11);
      ctx.lineTo(pos.x + 11, pos.y + 11);
      ctx.moveTo(pos.x + 11, pos.y - 11);
      ctx.lineTo(pos.x - 11, pos.y + 11);
      ctx.stroke();
      ctx.restore();
    }

    if (options.showLabels) {
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillStyle = '#40251b';
      ctx.textAlign = 'left';
      ctx.fillText(p.station, pos.x + 8, pos.y - 8);
    }
  }
}

function updateTable(data, details = []) {
  const tbody = $('dataTable').querySelector('tbody');
  tbody.innerHTML = '';
  const detMap = new Map(details.map(d => [d.station, d]));
  for (const p of data) {
    const d = detMap.get(p.station);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.station}</td>
      <td>${Number.isFinite(p.distance) ? p.distance.toFixed(1) : ''}</td>
      <td>${p.azimuth.toFixed(1)}°</td>
      <td>${p.takeoff.toFixed(1)}°</td>
      <td><b>${p.polarity}</b></td>
      <td>${p.cazimuth.toFixed(1)}°</td>
      <td>${p.ctakeoff.toFixed(1)}°</td>
      <td><span class="badge ${p.flipped ? 'yes' : 'no'}">${p.flipped ? '180° 修正' : '原值'}</span></td>
      <td>${d ? `${d.pred}${d.fit ? '' : ' ❌'}` : '—'}</td>`;
    tbody.appendChild(tr);
  }
}

function refresh() {
  const strike = Number($('strike').value);
  const dip = Number($('dip').value);
  const rake = Number($('rake').value);
  $('strikeOut').textContent = `${strike}°`;
  $('dipOut').textContent = `${dip}°`;
  $('rakeOut').textContent = `${rake}°`;

  const sc = scorePicks(picks, strike, dip, rake, true);
  $('fitScore').textContent = picks.length ? `${sc.fit} / ${sc.total}` : '—';
  $('mechanismText').textContent = picks.length ? explainMechanism(strike, dip, rake) : '載入資料後會顯示判讀結果。';
  const misfits = sc.detail.filter(d => !d.fit).map(d => d.station);
  $('misfitText').textContent = picks.length ? (misfits.length ? misfits.join('、') : '全部符合') : '—';
  drawSphere($('sphereCanvas'), picks, strike, dip, rake, {
    showBeachball: $('showBeach').checked,
    showLabels: $('showLabels').checked,
    showMisfit: $('showMisfit').checked
  });
  updateTable(picks, sc.detail);
}

function toCleanCsv(data) {
  const rows = [[
    'station','distance_km','azimuth_deg','takeoff_deg','polarity','corrected_azimuth_deg','corrected_takeoff_deg','takeoff_gt_90_corrected'
  ]];
  for (const p of data) {
    rows.push([p.station, p.distance, p.azimuth, p.takeoff, p.polarity, p.cazimuth.toFixed(3), p.ctakeoff.toFixed(3), p.flipped ? 'yes' : 'no']);
  }
  return rows.map(r => r.join(',')).join('\n');
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function autoSolve() {
  if (!picks.length) {
    $('solveStatus').textContent = '請先載入並整理資料。';
    return;
  }
  $('solveStatus').textContent = '搜尋中：coarse grid 5° → local refine 1°。';
  document.body.style.cursor = 'progress';
  setTimeout(() => {
    let best = { fit: -1, margin: -1, strike: 0, dip: 0, rake: 0 };
    for (let s = 0; s < 360; s += 5) {
      for (let d = 5; d <= 90; d += 5) {
        for (let r = -180; r <= 180; r += 5) {
          const sc = scorePicks(picks, s, d, r, false);
          if (sc.fit > best.fit || (sc.fit === best.fit && sc.margin > best.margin)) {
            best = { ...sc, strike: s, dip: d, rake: normRake(r) };
          }
        }
      }
    }
    const start = { ...best };
    for (let s = start.strike - 8; s <= start.strike + 8; s += 1) {
      for (let d = Math.max(1, start.dip - 8); d <= Math.min(90, start.dip + 8); d += 1) {
        for (let r = start.rake - 10; r <= start.rake + 10; r += 1) {
          const ss = norm360(s);
          const rr = normRake(r);
          const sc = scorePicks(picks, ss, d, rr, false);
          if (sc.fit > best.fit || (sc.fit === best.fit && sc.margin > best.margin)) {
            best = { ...sc, strike: ss, dip: d, rake: rr };
          }
        }
      }
    }
    $('strike').value = Math.round(best.strike);
    $('dip').value = Math.round(best.dip);
    $('rake').value = Math.round(best.rake);
    $('solveStatus').textContent = `最佳解：約 Strike=${Math.round(best.strike)}°，Dip=${Math.round(best.dip)}°，Rake=${Math.round(best.rake)}°；Fit=${best.fit}/${best.total}。注意：P 波初動可能有多組等價或近似解。`;
    document.body.style.cursor = 'default';
    refresh();
  }, 50);
}

// Deterministic pseudo random generator for game.
function mulberry32(seed) {
  let a = seed >>> 0;
  return function() {
    a += 0x6D2B79F5;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function randRange(rng, a, b) { return a + (b - a) * rng(); }
function randChoice(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }

const RANDOM_CASES = [
  '固定：低角度逆衝斷層',
  '固定：逆斷層／逆衝斷層',
  '固定：斜移斷層：逆衝成分 + 走向滑移成分',
  '固定：正斷層',
  '固定：斜移斷層：正斷成分 + 走向滑移成分',
  '固定：左移走向滑移斷層',
  '固定：右移走向滑移斷層'
];

function sampleMechanism(caseName, seed) {
  const rng = mulberry32(seed + 24680);
  let strike = randRange(rng, 0, 360);
  let dip, rake;
  if (caseName === '固定：低角度逆衝斷層') {
    dip = randRange(rng, 12, 27); rake = randRange(rng, 72, 106);
  } else if (caseName === '固定：逆斷層／逆衝斷層') {
    dip = randRange(rng, 38, 68); rake = randRange(rng, 74, 108);
  } else if (caseName === '固定：斜移斷層：逆衝成分 + 走向滑移成分') {
    dip = randRange(rng, 32, 74); rake = randChoice(rng, [randRange(rng, 32, 63), randRange(rng, 117, 148)]);
  } else if (caseName === '固定：正斷層') {
    dip = randRange(rng, 38, 74); rake = randRange(rng, -108, -74);
  } else if (caseName === '固定：斜移斷層：正斷成分 + 走向滑移成分') {
    dip = randRange(rng, 32, 76); rake = randChoice(rng, [randRange(rng, -63, -32), randRange(rng, -148, -117)]);
  } else if (caseName === '固定：左移走向滑移斷層') {
    dip = randRange(rng, 78, 90); rake = randRange(rng, -14, 14);
  } else {
    dip = randRange(rng, 78, 90); rake = randChoice(rng, [randRange(rng, 166, 179), randRange(rng, -179, -166)]);
  }
  return { strike, dip, rake: normRake(rake), label: caseName.replace('固定：', '') };
}

function makeGame() {
  const seed = Number($('gameSeed').value);
  const n = Number($('stationCount').value);
  let mode = $('gameMode').value;
  if (mode === '隨機多樣題型（seed 會決定題型）') mode = RANDOM_CASES[seed % RANDOM_CASES.length];
  const mech = sampleMechanism(mode, seed);
  const rng = mulberry32(seed + 100000);
  const M = momentComponents(mech.strike, mech.dip, mech.rake);
  const stations = [];
  for (let i = 0; i < n; i++) {
    const baseAz = i * 360 / n;
    const az = norm360(baseAz + randRange(rng, -360 / n * 0.35, 360 / n * 0.35));
    const take = i < n * 0.45 ? randRange(rng, 12, 42) : randRange(rng, 43, 84);
    const v = vectorFromAzTake(az, take);
    const a = amplitude(v, M);
    stations.push({ station: `S${String(i + 1).padStart(2, '0')}`, azimuth: az, takeoff: take, cazimuth: az, ctakeoff: take, polarity: a >= 0 ? '+' : '-', vector: v });
  }
  currentGame = { ...mech, stations };
  drawGame();
}

function drawGame() {
  if (!currentGame) return;
  drawSphere($('gameCanvas'), currentGame.stations, currentGame.strike, currentGame.dip, currentGame.rake, {
    showBeachball: $('showAnswer').checked,
    showLabels: false,
    showMisfit: false
  });
}

function checkGuess() {
  if (!currentGame) makeGame();
  const guess = $('guess').value;
  const answer = classifyFault(currentGame.dip, currentGame.rake);
  if (guess === '先不猜') {
    $('gameFeedback').textContent = '先觀察：黑點是 +，白點是 −。試著找黑白交界，再選一個答案。';
    return;
  }
  gameTotal += 1;
  if (guess === answer) {
    gameCorrect += 1;
    $('gameFeedback').textContent = `答對了！正解是 ${answer}。實際參數：Strike=${Math.round(currentGame.strike)}°，Dip=${Math.round(currentGame.dip)}°，Rake=${Math.round(currentGame.rake)}°。`;
  } else {
    $('gameFeedback').textContent = `再想一下：你猜「${guess}」，正解較接近「${answer}」。實際參數：Strike=${Math.round(currentGame.strike)}°，Dip=${Math.round(currentGame.dip)}°，Rake=${Math.round(currentGame.rake)}°。`;
  }
  $('showAnswer').checked = true;
  $('gameScore').textContent = `${gameCorrect} / ${gameTotal}`;
  drawGame();
}

function bindEvents() {
  $('loadSample').addEventListener('click', () => {
    $('dataInput').value = P25_SAMPLE_CSV;
    picks = parseInput($('dataInput').value);
    $('solveStatus').textContent = `已載入 P25 範例：${picks.length} 筆有初動資料。`;
    refresh();
  });
  $('clearData').addEventListener('click', () => {
    $('dataInput').value = ''; picks = []; refresh();
  });
  $('parseData').addEventListener('click', () => {
    picks = parseInput($('dataInput').value);
    $('solveStatus').textContent = picks.length ? `已整理 ${picks.length} 筆有 + / − 初動的測站。` : '沒有讀到可用的 + / − 初動資料。';
    refresh();
  });
  $('downloadCsv').addEventListener('click', () => downloadText('cleaned_first_motion.csv', toCleanCsv(picks)));
  ['strike','dip','rake','showBeach','showLabels','showMisfit'].forEach(id => $(id).addEventListener('input', refresh));
  $('autoSolve').addEventListener('click', autoSolve);
  $('useKnown').addEventListener('click', () => {
    $('strike').value = KNOWN_SOLUTION.strike;
    $('dip').value = KNOWN_SOLUTION.dip;
    $('rake').value = KNOWN_SOLUTION.rake;
    $('solveStatus').textContent = '已套用本作業參考解：Strike=102°，Dip=30°，Rake=-11°。';
    refresh();
  });
  $('gameSeed').addEventListener('input', () => { $('seedOut').textContent = $('gameSeed').value; });
  $('stationCount').addEventListener('input', () => { $('stationOut').textContent = $('stationCount').value; });
  $('showAnswer').addEventListener('input', drawGame);
  $('newGame').addEventListener('click', () => {
    $('showAnswer').checked = false;
    $('guess').value = '先不猜';
    makeGame();
    $('gameFeedback').textContent = '新題目已產生。先看黑白點，不要急著打開答案。';
  });
  $('checkGuess').addEventListener('click', checkGuess);
}

document.addEventListener('DOMContentLoaded', () => {
  bindEvents();
  $('dataInput').value = P25_SAMPLE_CSV;
  picks = parseInput(P25_SAMPLE_CSV);
  refresh();
  makeGame();
});
