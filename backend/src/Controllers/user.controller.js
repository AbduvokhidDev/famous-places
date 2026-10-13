const prisma = require("../prisma");

const sync = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;
    const user = await prisma.user.upsert({
      where: { id: req.userId },
      update: { name, email, avatar },
      create: {
        id: req.userId,
        name,
        email,
        avatar,
      },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { _count: { select: { place: true, comments: true } } },
    });
    if (!user) {
      return res.status(404).json({ success: false, error: "user topilmadi" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        avatar: true,
        createdAt: true,
        _count: { select: { place: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

module.exports = { sync, getAll, me };
