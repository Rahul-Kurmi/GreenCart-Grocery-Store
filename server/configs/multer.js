import multer from "multer";

// used to upload any image in cloudinary storage
export const upload = multer({storage: multer.diskStorage({})});