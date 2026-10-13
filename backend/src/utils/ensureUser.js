const prisma = require("../prisma");

async function ensureUser(userId) {
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  });
}

module.exports = ensureUser;
