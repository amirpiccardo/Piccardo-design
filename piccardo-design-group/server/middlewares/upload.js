const multer = require("multer");
const path = require("path");

const ALLOWED_TYPES = /jpeg|jpg|png|gif|webp|avif/;
const MAX_SIZE_MB = 2; // limite ragionevole per immagini salvate nel DB

// memoryStorage: il file resta in RAM come buffer, poi lo salviamo nel DB come
// data URI base64 -> persistente (Render free ha il disco effimero)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const extOk = ALLOWED_TYPES.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = ALLOWED_TYPES.test(file.mimetype);
  if (extOk && mimeOk) return cb(null, true);
  cb(new Error("Solo immagini consentite (jpeg, jpg, png, gif, webp, avif)"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
});

// Converte il file caricato in un data URI base64 da salvare nel DB
function fileToDataUri(file) {
  if (!file) return null;
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
}

module.exports = upload;
module.exports.fileToDataUri = fileToDataUri;
