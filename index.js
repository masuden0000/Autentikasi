const express = require("express");
const session = require("express-session");
const passport = require("passport");
const googleRouter = require("./src/controllers/googleAuth");
const facebookRouter = require("./src/controllers/facebookAuth");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;

require("dotenv").config();

app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.users.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

app.get("/", (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.render("register");
  }else{
    return res.redirect("/auth/profile");
  }
});

app.use("/auth", googleRouter);
app.use("/auth", facebookRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
