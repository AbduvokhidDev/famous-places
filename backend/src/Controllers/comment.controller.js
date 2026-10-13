const prisma = require("../prisma");
const ensureUser = require("../utils/ensureUser");

const userSelect = { id: true, name: true, avatar: true };

const getAllForPlace = async (req, res, next) => {
  try {
    const placeId = parseInt(req.params.id, 10);
    if (Number.isNaN(placeId)) {
      return res.status(400).json({ success: false, error: "invalid id" });
    }

    const place = await prisma.place.findUnique({
      where: { id: placeId },
    });
    if (!place) {
      return res.status(404).json({ success: false, error: "joy topilmadi" });
    }

    const comments = await prisma.comment.findMany({
      where: { placeId },
      include: { user: { select: userSelect } },
      orderBy: { createdAt: "asc" },
    });

    res.json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const placeId = parseInt(req.params.id, 10);
    if (Number.isNaN(placeId)) {
      return res.status(400).json({ success: false, error: "invalid id" });
    }

    const place = await prisma.place.findUnique({
      where: { id: placeId },
    });
    if (!place) {
      return res.status(404).json({ success: false, error: "joy topilmadi" });
    }

    const { text, parentId } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: "matn bo'sh" });
    }

    const parent = parentId ? parseInt(parentId, 10) : null;
    if (parent) {
      const parentComment = await prisma.comment.findFirst({
        where: { id: parent, placeId },
      });
      if (!parentComment) {
        return res
          .status(404)
          .json({ success: false, error: "asosiy kament yoq" });
      }
    }

    await ensureUser(req.userId);

    const comment = await prisma.comment.create({
      data: {
        text: text.trim(),
        userId: req.userId,
        placeId,
        parentId: parent,
      },
      include: { user: { select: userSelect } },
    });

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, error: "invalid id" });
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
    });
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, error: "komment topilmadi" });
    }

    if (comment.userId !== req.userId) {
      return res.status(403).json({
        success: false,
        error: "faqat o'zingizning kommentingizni o'chirishingiz mumkin",
      });
    }

    await prisma.comment.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllForPlace, create, remove };
