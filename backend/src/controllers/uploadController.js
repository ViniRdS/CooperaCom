const path = require("path");
const { supabase } = require("../services/supabaseClient");

async function uploadAvatar(req, res) {
    if (!req.file) {
        return res.status(400).json({ message: "Nenhum arquivo enviado" });
    }

    const driver = process.env.STORAGE_DRIVER || "local";

    try {
        // --- MODO LOCAL ---
        if (driver === "local") {
            const fileUrl = `http://localhost:${process.env.PORT}/uploads/avatars/${req.file.filename}`;
            return res.json({ success: true, url: fileUrl });
        }

        // --- MODO SUPABASE ---
        if (driver === "supabase") {
            const bucket = process.env.SUPABASE_BUCKET || "avatars";

            const fileBuffer = req.file.buffer;
            const filePath = `avatars/${req.file.filename}`;

            const { error: uploadError } = await supabase
                .storage
                .from(bucket)
                .upload(filePath, fileBuffer, {
                    contentType: req.file.mimetype,
                    upsert: true
                });

            if (uploadError) {
                console.error(uploadError);
                return res.status(500).json({ message: "Erro ao enviar arquivo ao Supabase" });
            }

            const { data } = supabase
                .storage
                .from(bucket)
                .getPublicUrl(filePath);

            return res.json({ success: true, url: data.publicUrl });
        }

    } catch (err) {
        console.error("Erro no upload:", err);
        return res.status(500).json({ message: "Erro interno no upload." });
    }
}

module.exports = { uploadAvatar };
