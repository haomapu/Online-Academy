import multer from "multer";

var upload = multer({ storage: multer.diskStorage({
    filename: function (req, file, cb) {
    cb(null, file.originalname);
    }
  })
})
export default upload;
