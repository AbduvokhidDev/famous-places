const express = require("express");
const router = express.Router();
const controller = require("../Controllers/user.controller");
const requireAuth = require("../middlewares/auth.middleware");

router.post("/users/sync", requireAuth, controller.sync);
router.get("/users/me", requireAuth, controller.me);
router.get("/users", controller.getAll);

module.exports = router;
