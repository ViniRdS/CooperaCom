const express = require("express");
const router = express.Router();

const upload = require("../services/uploadService");
const { uploadAvatar } = require("../controllers/uploadController");
const { requireAuth } = require("../middleware/authMiddleware");

router.post("/avatar", requireAuth, upload.single("avatar"), uploadAvatar);

module.exports = router;
