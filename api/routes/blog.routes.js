import express from "express";
import { createBlog, deleteBlog, getBlogById, getBlogCount, getBlogInfo, getBlogs, getBlogsByUser, getBlogsLimit, updateBlog, upload, uploadImage } from "../controllers/blog.control.js";



const router = express.Router()

router.post("/create", upload.single('file'), uploadImage, createBlog);
router.get("/get", getBlogs, getBlogInfo);
router.get("/getlimit", getBlogsLimit);
router.get("/get/:id", getBlogById);
router.put('/put/:id', upload.single('file'), updateBlog);
router.get("/getbyuser", getBlogsByUser);
router.get("/count", getBlogCount);
router.delete("/get/:id", deleteBlog);


export default router;