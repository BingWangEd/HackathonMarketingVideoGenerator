import express from "express";
import multer from "multer";
import fs from "fs";
import OpenAI from "openai";

const app = express();
const upload = multer({ dest: "uploads/" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Accept up to 5 images
app.post("/describe-image", upload.array("images", 3), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No images uploaded" });
  }

  try {
    var descriptions = await describeImages(req.files);
    var generalDescriptions = "These are descriptions of a person's recent life events including things they see and care about. Create a storyline for an advertisement to sell this person a ring. Make the story personally relatable to the person." + descriptions;
    console.log("descriptions: " + generalDescriptions);
    const response = await openai.responses.create({
        model: "gpt-5",
        input: generalDescriptions
    });

    console.log("Ad script: ");
    console.log(response.output_text);

    let videoId = null;

    const productImagePath = "ring.jpg";

    // Read file into buffer
    const buffer = fs.readFileSync(productImagePath);

    // Wrap it in a Blob and set the MIME type
    const fileBlob = new Blob([buffer], { type: "image/jpeg" });

    console.log("calling images");
    const videoResponse = await openai.videos.create({
      model: "sora-2-pro",
      prompt: response.output_text,
      size: "1280x720",
      seconds: 8,
      input_reference: fileBlob,
    });

    videoId = videoResponse.data.id;

    res.json({
      general_descriptions: generalDescriptions,
      video_id: videoId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

async function describeImages(files) {
  if (!files || files.length === 0) {
    throw new Error("No images provided");
  }

  var descriptions = "";

  for (const file of files) {
    const base64Image = fs.readFileSync(file.path, "base64");

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

    descriptions += response.output_text;

    // Clean up temporary file
    fs.unlink(file.path, () => {});
  }

  return descriptions;
}

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
