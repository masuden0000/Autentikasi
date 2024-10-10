const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

const speedLimiter = rateLimit({
  windowMs: 3 * 60 * 1000,
  max: 6,
  message: "Terlalu banyak permintaan, coba lagi setelah 6 menit.",
  standardHeaders: true,
  legacyHeaders: false,
});

const slowDownLimiter = slowDown({
  windowMs: 3000,
  delayAfter: 3,
  delayMs: () => 10000,
});
module.exports = { speedLimiter, slowDownLimiter };
