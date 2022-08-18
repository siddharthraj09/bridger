import multer from "multer";
//!for uploding csv
const csvFilter = (req, file, cb) => {
  if (file.mimetype.includes("csv")) {
    cb(null, true);
  } else {
    cb("Please upload only csv file.", false);
  }
};
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log(file)
    cb(null,file.fieldname+"/uploads/");
  },
  filename: (req, file, cb) => {
    // console.log(file.originalname);
    cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
  },
});
var uploadFile = multer({ storage: storage, fileFilter: csvFilter });

export {uploadFile}