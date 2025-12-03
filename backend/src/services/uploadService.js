const multer = require("multer");
const path = require("path");
const fs = require("fs");

const driver = process.env.STORAGE_DRIVER || "local";

// --- STORAGE LOCAL ---
let storage;

if (driver === "local") {
    const uploadPath = path.join(__dirname, "..", "uploads", "avatars");
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            const fileName = `avatar_${req.userId}${ext}`;
            cb(null, fileName);
        }
    });

} else {
    // --- STORAGE SUPABASE ---
    storage = multer.memoryStorage();
}

function fileFilter(req, file, cb) {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
        return cb(new Error("Tipo de arquivo inválido!"));
    }
    cb(null, true);
}

const upload = multer({ storage, fileFilter });

module.exports = upload;
