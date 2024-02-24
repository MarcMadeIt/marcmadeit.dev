import express from "express";
import * as blogController from '../../controllers/blog.control.js';


const router = express.Router()

router.post("/create", upload.single('file'), uploadImage, blogController.createBlog);
router.get("/get", getBlogs, blogController.getBlogInfo);
router.get("/getlimit", blogController.getBlogsLimit);
router.get("/get/:id", blogController.getBlogById);
router.put('/put/:id', upload.single('file'), blogController.updateBlog);
router.get("/getbyuser", blogController.getBlogsByUser);
router.get("/count", blogController.getBlogCount);
router.delete("/get/:id", blogController.deleteBlog);


export default router;