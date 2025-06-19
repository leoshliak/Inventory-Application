const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = {
  categoryImage: upload.single('image'), 
  gameImages: upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'hero_image', maxCount: 1 }
  ])
};
