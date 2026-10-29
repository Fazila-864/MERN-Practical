const fs = require("fs");
const path = require("path");
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
const deleteFile = (filename) => {
  try {
    const filePath = path.join(UPLOAD_DIR, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("File delete error:", error.message);
  }
};

module.exports = { deleteFile };
