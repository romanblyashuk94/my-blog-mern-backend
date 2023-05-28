import { Router } from 'express';
import { checkAuth } from '../utils/checkAuth.js';
import { createComment, removeComment } from '../controllers/comments.js';

const router = new Router();

// Create Comment
// http://localhost:3002/api/comments/:postId
router.post('/:id', checkAuth, createComment);

// Remove Comment
// http://localhost:3002/api/comments/:postId
router.delete('/:id', checkAuth, removeComment);


export default router