const express = require("express");
const router = express.Router();
const { prisma } = require("../../libs/prisma");
const { speedLimiter, slowDownLimiter } = require("../../libs/rateLimit");
const { registerUser } = require("../../models/loginRegsiterModels");
const {
  findUserByEmail,
  findUserByUsername,
} = require("../../models/userModels");

router.use(express.json());
router.use(speedLimiter);
router.use(slowDownLimiter);

router.post("/register", async (req, res) => {
  const { nama, username, email, password } = req.body;

  if (!nama || !username || !email || !password) {
    return res.status(400).json({ message: "Semua input harus diisi" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Email tidak valid" });
  }

  try {
    const findUsername = await findUserByUsername(username);
    const findEmail = await findUserByEmail(email);
    // if (findUsername) {
    //   return res
    //     .status(400)
    //     .json({ message: `Username ${findUsername} sudah digunakan` });
    // }

    // if (findEmail) {
    //   console.log(findEmail);
    //   return res
    //     .status(400)
    //     .json({ message: `Email ${findEmail} sudah digunakan` });
    // }

    await registerUser(nama, username, email, password);
    return res.status(201).json({ message: "Registrasi berhasil" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
});

router.get("/register", async (req, res) => {
  const users = await prisma.users.findMany();
  res.json({ data: users });
});

// tambahkan endpoint "/" dengan middleware validation

module.exports = router;
