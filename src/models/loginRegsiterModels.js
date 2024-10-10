const bcrypt = require("bcrypt");
const {prisma} = require("../libs/prisma");
const CryptoJS = require("crypto-js");

async function registerUser(nama, username, email, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const randomString = CryptoJS.SHA256(Date.now().toString())
      .toString(CryptoJS.enc.Hex)
      .substr(0, 16);

    await prisma.users.create({
      data: {
        id: randomString,
        nama: nama,
        username: username,
        email: email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

module.exports = { registerUser };
