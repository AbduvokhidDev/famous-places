const prisma = require("../prisma");

const getAllpleace = async (req, res, next) => {
  try {
    const places = await prisma.place.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: places });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid ID" });
    }
    const place = await prisma.place.findFirst({
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

const createpleace = async (req, res, next) => {
  try {
    const { title, description, location, rate, imageUrl,davlat } = req.body;

    const newPlace = await prisma.place.create({
      data: {
        davlat:davlat||"nomlum",
        title,
        description: description || null,
        imageUrl: imageUrl || null,
        rate: rate || null,
        location: location || null,
        userId: req.userId,
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
    const existingPlace = await prisma.place.findFirst({
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

const deletepleace = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid ID" });
    }
    const existingPlace = await prisma.place.findFirst({
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
