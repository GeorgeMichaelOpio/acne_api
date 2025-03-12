import express from "express";
import multer from "multer";
import { Client } from "@gradio/client";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/predict", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const client = await Client.connect("georgemichaelopio/acne");
        const imageBuffer = fs.readFileSync(req.file.path);
        const imageBlob = new Blob([imageBuffer]);

        const result = await client.predict("/predict", {
            image_path: imageBlob,
        });

        res.json(result.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
