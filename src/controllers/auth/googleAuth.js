const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const {
  handleGoogleAuth,
  deletedAccount,
} = require("../../config/handleGoogleAuth");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET_KEY,
      callbackURL: process.env.CALLBACK_URL,
    },
    handleGoogleAuth
  )
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/profile",
    failureRedirect: "/",
  })
);

router.get("/profile", (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/google");
  }
  res.render("profile", {
    nama: req.user.nama,
    email: req.user.email,
    id: req.user.id,
  });
});

router.get("/logout", async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  const userId = req.user.id;

  deletedAccount(userId)
    .then(() => {
      req.logout((err) => {
        req.session.destroy((err) => {
          if (err) {
            res.status(500).send("Terjadi kesalahan saat logout");
          }
        });

        req.session = null;
        res.redirect("/");
      });
    })
    .catch((error) => {
      console.error("Error saat menghapus akun:", error);
      res.status(500).send("Terjadi kesalahan saat menghapus akun");
    });
});

module.exports = router;
