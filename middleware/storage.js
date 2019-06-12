const multer = require('multer');
const path = require('path');

const fileUploadPath = './uploads';

const storage = multer.diskStorage({
    destination: fileUploadPath,
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + file.originalname);
    },
});

const upload  = multer({ storage: storage });

module.exports = upload;