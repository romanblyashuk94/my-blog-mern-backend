import { Router } from 'express';
import { checkAuth } from '../utils/checkAuth.js';
import { createPost, getAllPosts, getPostById, getMyPosts, updatePost, removePost } from '../controllers/posts.js';

const router = new Router();

// Create Post
// http://localhost:3002/api/posts/
router.post('/', checkAuth, createPost);

// Get all posts
// http://localhost:3002/api/posts/
router.get('/', getAllPosts);

// Get post by ID
// http://localhost:3002/api/posts/
router.get('/:id', getPostById);

// Get My Posts
// http://localhost:3002/api/posts/user/me
router.get('/user/me', checkAuth, getMyPosts);

// Update post
// http://localhost:3002/api/posts/:id
router.put('/:id', checkAuth, updatePost);

// Delete post
// http://localhost:3002/api/posts/:id
router.delete('/:id', checkAuth, removePost);

export default router