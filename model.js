/* Power Law Lab: the simulation model. Pure functions, no DOM, runs in the browser and in Node. */
var PL = (function () {
  // Seeded random numbers (mulberry32) so every result can be reproduced.
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Outcome odds for one startup. bust and home are chosen by the user;
  // the rest is split among "break even", "good" and "great" in a fixed ratio.
  function probs(bust, home) {
    var rest = 1 - bust - home, k = 0.28 + 0.09 + 0.025;
    return { bust: bust, brk: rest * 0.28 / k, good: rest * 0.09 / k, great: rest * 0.025 / k, home: home };
  }

  // The return multiple of one $1 investment in one startup.
  function startup(rand, p) {
    var u = rand();
    if (u < p.bust) return 0;                         // total loss
    u -= p.bust; if (u < p.brk) return 0.3 + 1.2 * rand();   // 0.3x to 1.5x
    u -= p.brk; if (u < p.good) return 2 + 4 * rand();       // 2x to 6x
    u -= p.good; if (u < p.great) return 6 + 19 * rand();    // 6x to 25x
    return Math.exp(Math.log(30) + rand() * Math.log(200 / 30)); // home run: 30x to 200x
  }

  // One fund: n equal checks. Returns every startup's multiple.
  function fund(rand, n, p) {
    var out = [];
    for (var i = 0; i < n; i++) out.push(startup(rand, p));
    return out;
  }

  var sum = function (a) { return a.reduce(function (x, y) { return x + y; }, 0); };
  var median = function (a) { var s = a.slice().sort(function (x, y) { return x - y; }); return s[Math.floor(s.length / 2)]; };

  // Simulate many funds and summarize them.
  function simulate(n, p, runs, seed) {
    var rand = rng(seed), mult = [], top = [];
    for (var r = 0; r < runs; r++) {
      var f = fund(rand, n, p), total = sum(f);
      mult.push(total / n);
      top.push(total > 0 ? Math.max.apply(null, f) / total : 0);
    }
    var share = function (test) { return mult.filter(test).length / runs; };
    return { multiples: mult, median: median(mult), loss: share(function (m) { return m < 1; }),
             ge3: share(function (m) { return m >= 3; }), topShare: median(top) };
  }

  return { rng: rng, probs: probs, startup: startup, fund: fund, simulate: simulate, sum: sum };
})();
if (typeof module !== "undefined") module.exports = PL;
