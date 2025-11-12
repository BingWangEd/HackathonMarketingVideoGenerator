import express from "express";
import multer from "multer";
import fs from "fs";
import OpenAI from "openai";

const app = express();
const upload = multer({ dest: "uploads/" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });



// POST /describe-image
app.post("/describe-image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  try {
    // Read uploaded image and convert to Base64
    const base64Image = fs.readFileSync(req.file.path, "base64");

    // Call OpenAI Responses API
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: "What's in this image?" },
            { type: "input_image", image_url: `data:image/jpeg;base64,${base64Image}` },
          ],
        },
      ],
    });

    res.json({ description: response.output_text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    // Clean up temporary uploaded file
    fs.unlink(req.file.path, () => {});
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
