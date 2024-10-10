const prisma = require("../libs/prisma");

const handleGoogleAuth = async (accessToken, refreshToken, profile, done) => {
  // console.log("Google profile: ", profile);

  try {
    const existingUser = await prisma.users.findUnique({
      where: {
        id: profile.id,
      },
    });

    if (existingUser) {
      return done(null, false);
    }

    const randomSuffix = Math.floor(Math.random() * 10000);
    username = `user_${randomSuffix}`;
    
    const newUser = await prisma.users.create({
      data: {
        id: profile.id,
        email: profile._json.email,
        nama: profile.displayName,
        username: username,
      },
    });

    return done(null, newUser);
  } catch (error) {
    console.error("Error dalam proses autentikasi Google:", error);
    return done(error);
  }
};

const deletedAccount = (userId) => {
  return prisma.users
    .delete({
      where: {
        id: userId,
      },
    })
    .then((deletedUser) => {
      return deletedUser;
    })
    .catch((error) => {
      console.error("Error saat menghapus pengguna:", error);
      throw error;
    });
};

module.exports = { handleGoogleAuth, deletedAccount };
