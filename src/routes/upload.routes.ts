import { Router } from 'express';
import { upload  } from '../middleware/upload.ts'; 
import { uploadVideo } from '../controllers/upload.controller.ts';

const router = Router();
router.post("/upload", upload.single("video"), uploadVideo);

export default router;