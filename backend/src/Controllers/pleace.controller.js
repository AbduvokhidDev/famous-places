const prisma = require("../prisma");

const getAllpleace = async (req, res) => {
  try {
    const res = await prisma.place.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: res });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (Numver.isNuN(id)) {
      return res.status(400).json({ success: false, error: "Invalid ID" });
    }
    const place = await prisma.place.findUnique({
      where: { id, userId: req.userId },
    });
    if (!place) {
      return res.status(404).json({ success: false, error: "Place not found" });
    }
    res.json({ success: true, data: place });
  } catch (error) {
    next(error);
  }
};
// //////////////////////////////////////////////////////
const createpleace = async (req, res, next) => {
  try {
    const { title, description, location, userId, rate, imageUrl } = req.body;

    const newPlace = await prisma.place.create({
      data: {
        title,
        description: description || null,
        imageUrl: imageUrl || null,

        rate: rate || null,
        userId: req.userId,
        location: location || null,
      },
    });
    res.status(201).json({ success: true, data: newPlace });
  } catch (error) {
    next(error);
  }
};
const updatepleace = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid ID" });
    }
    const existingPlace = await prisma.place.findUnique({
      where: { id, userId: req.userId },
    });
    if (!existingPlace) {
      return res.status(404).json({ success: false, error: "Place not found" });
    }
    const item = await prisma.place.update({
      where: { id },
      data: req.body,
    });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};
// //////////////////////////////////////////////////////
const deletepleace = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid ID" });
    }
    const existingPlace = await prisma.place.findUnique({
      where: { id, userId: req.userId },
    });
    if (!existingPlace) {
      return res.status(404).json({ success: false, error: "Place not found" });
    }
    await prisma.place.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllpleace,
  getById,
  createpleace,
  updatepleace,
  deletepleace,
};
