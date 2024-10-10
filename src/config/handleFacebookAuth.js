const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const handleFacebookAuth = async (accessToken, refreshToken, profile, done) => {
  console.log("Facebook profile: ", profile);

  try {
    // Cek apakah pengguna sudah ada di database
    const existingUser = await prisma.users.findUnique({
      where: {
        id: profile.id,
      },
    });

    if (existingUser) {
        return done(null, false);
    }

    // Jika pengguna belum ada, buat pengguna baru
    const newUser = await prisma.users.create({
      data: {
        id: profile.id,
        email: profile._json.email,
        nama: profile.displayName,
      },
    });

    // Kembalikan profil pengguna baru
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

module.exports = { handleFacebookAuth, deletedAccount };
