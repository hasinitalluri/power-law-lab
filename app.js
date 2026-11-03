const $ = (s) => document.querySelector(s);
const pct = (x) => Math.round(x * 100) + "%";
let seed = 1;

function settings() {
  const n = +$("#n").value, b = +$("#b").value, h = +$("#h").value;
  $("#nV").textContent = n; $("#bV").textContent = b + "%"; $("#hV").textContent = h + "%";
  return { n, p: PL.probs(b / 100, h / 100) };
}

function histogram(multiples) {
  const bins = new Array(13).fill(0);              // 0.5x wide bins, last bin is 6x and up
  multiples.forEach((m) => bins[Math.min(12, Math.floor(m / 0.5))]++);
  const max = Math.max(...bins), w = 44, base = 215;
  let s = "";
  bins.forEach((c, i) => {
    const h = (c / max) * 180;
    s += `<rect x="${30 + i * 50}" y="${base - h}" width="${w}" height="${h}" rx="3" fill="${i < 2 ? "var(--mute)" : "var(--accent)"}"/>`;
    if (i % 2 === 0) s += `<text x="${30 + i * 50 - 4}" y="236">${i / 2}x</text>`;
  });
  s += `<text x="${30 + 12 * 50 - 4}" y="236">6x+</text>`;
  s += `<line x1="130" x2="130" y1="20" y2="${base}" stroke="var(--ink)" stroke-width="2" stroke-dasharray="5 4"/><text x="136" y="30">Break even (1x)</text>`;
  $("#hist").innerHTML = s;
}

function field() {
  const { n, p } = settings();
  const f = PL.fund(PL.rng(seed), n, p).sort((a, b) => b - a), total = PL.sum(f);
  $("#field").innerHTML = f.map((m) => {
    const d = m === 0 ? 12 : Math.min(190, 18 + 13 * Math.sqrt(m));
    const cls = m === 0 ? "zero" : m >= 30 ? "home" : m >= 6 ? "great" : m >= 2 ? "good" : "small";
    return `<span class="dot ${cls}" style="width:${d}px;height:${d}px" title="${m.toFixed(1)}x"></span>`;
  }).join("");
  const lost = f.filter((m) => m === 0).length;
  $("#fieldMsg").textContent = `The best startup returned ${f[0].toFixed(1)}x, which is ${pct(f[0] / total)} of the fund’s total value. ${lost} of ${n} startups lost everything. The fund returned ${(total / n).toFixed(2)}x overall.`;
}

function run() {
  const { n, p } = settings();
  const r = PL.simulate(n, p, 3000, 42);
  $("#tiles").innerHTML = [
    ["Typical fund return", r.median.toFixed(2) + "x"],
    ["Funds that lose money", pct(r.loss)],
    ["Funds that return 3x or more", pct(r.ge3)],
    ["Share of value from the best startup", pct(r.topShare)]
  ].map(([k, v]) => `<div class="tile"><small>${k}</small><strong>${v}</strong></div>`).join("");
  histogram(r.multiples);
  $("#table").innerHTML = "<tr><th>Startups in fund</th><th>Typical return</th><th>Lose money</th><th>Return 3x+</th></tr>" +
    [5, 10, 25, 50].map((k) => {
      const t = PL.simulate(k, p, 2000, 42);
      return `<tr><td class="hl">${k}</td><td>${t.median.toFixed(2)}x</td><td>${pct(t.loss)}</td><td>${pct(t.ge3)}</td></tr>`;
    }).join("");
  field();
}

document.querySelectorAll("input").forEach((e) => e.addEventListener("input", run));
$("#again").addEventListener("click", () => { seed++; field(); });
run();
