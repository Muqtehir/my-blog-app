const https = require("https");

exports.uploadImage = async (req, res) => {
  try {
    console.log("[uploadImage] File received:", req.file?.originalname);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert buffer to base64 for ImgBB API
    const base64Image = req.file.buffer.toString("base64");
    const postData = JSON.stringify({
      image: base64Image,
    });

    const options = {
      hostname: "api.imgbb.com",
      path: "/1/upload?key=9a509c0b0f5e73b891e47f8c8c8c8c8c",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const request = https.request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        try {
          const jsonResponse = JSON.parse(data);
          if (jsonResponse?.success && jsonResponse?.data?.url) {
            console.log(
              "[uploadImage] Upload successful:",
              jsonResponse.data.url
            );
            res.status(200).json({ url: jsonResponse.data.url });
          } else {
            console.error("[uploadImage] ImgBB error:", jsonResponse);
            res
              .status(500)
              .json({ message: "Failed to upload image to ImgBB" });
          }
        } catch (parseErr) {
          console.error("[uploadImage] Parse error:", parseErr.message);
          res.status(500).json({ message: "Invalid response from ImgBB" });
        }
      });
    });

    request.on("error", (err) => {
      console.error("[uploadImage] Request error:", err.message);
      res.status(500).json({ message: err.message || "Upload failed" });
    });

    request.write(postData);
    request.end();
  } catch (err) {
    console.error("[uploadImage] Error:", err.message);
    res.status(500).json({ message: err.message || "Upload failed" });
  }
};
