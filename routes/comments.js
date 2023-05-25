import { Router } from 'express';
import { checkAuth } from '../utils/checkAuth.js';
import { createComment } from '../controllers/comments.js';

const router = new Router();

// Create Comment
// http://localhost:3002/api/comments/:postId
router.post('/:postId', checkAuth, createComment);


export default router