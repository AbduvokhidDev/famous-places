const express = require("express");
const router = express.Router();
const controller = require("../Controllers/comment.controller");
const requireAuth = require("../middlewares/auth.middleware");

router.get("/places/:id/comments", controller.getAllForPlace);
router.post("/places/:id/comments", requireAuth, controller.create);
router.delete("/comments/:id", requireAuth, controller.remove);

module.exports = router;
