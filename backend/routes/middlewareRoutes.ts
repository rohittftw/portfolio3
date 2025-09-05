import express from "express";

import { authenticateAdmin } from "../middleware/auth";


const router = express.Router();


router.post("/test-middleware",authenticateAdmin);


export default router;
