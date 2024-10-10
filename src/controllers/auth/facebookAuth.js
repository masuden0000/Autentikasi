const express = require("express");
const router = express.Router();
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const {
  handleFacebookAuth,
  deletedAccount,
} = require("../../config/handleFacebookAuth");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

require("dotenv").config();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.CLIENT_ID_FACEBOOK,
      clientSecret: process.env.CLIENT_SECRET_KEY_FACEBOOK,
      callbackURL: process.env.CALLBACK_URL_FACEBOOK,
    },
    handleFacebookAuth
  )
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["public_profile", "email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/auth/profile",
    failureRedirect: "/",
  })
);

router.get("/profile", (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/facebook");
  }
  res.render("profile", {
    nama: req.user.nama,
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
