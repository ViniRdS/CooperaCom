const path = require("path");

async function uploadAvatar(req, res) {
    if (!req.file) {
        return res.status(400).json({ message: "Nenhum arquivo enviado" });
    }

    const fileUrl = `/uploads/avatars/${req.file.filename}`;

    return res.json({
        url: fileUrl
    });
}

module.exports = { uploadAvatar };
