const express = require("express");
const router = express.Router();
const pleaceController = require("../Controllers/pleace.controller");
const requireAuth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate");
const {
  createPlaceSchema,
  updatePlaceSchema,
} = require("../Validations/place.validation");
router.get("/famous", pleaceController.getFamousPlaces);
router.use(requireAuth);

router.get("/", pleaceController.getAllpleace);
router.get("/:id", pleaceController.getById);
router.post("/", validate(createPlaceSchema), pleaceController.createpleace);
router.put("/:id", validate(updatePlaceSchema), pleaceController.updatepleace);
router.delete("/:id", pleaceController.deletepleace);

module.exports = router;
