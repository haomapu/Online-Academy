import multer from "multer";

var upload = multer({ storage: multer.diskStorage({
    filename: function (req, file, cb) {
    cb(null, file.originalname);
    console.log(file);
    console.log('123');
    }
  })
})
export default upload;
