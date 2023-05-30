import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url'

// Create Post
export const createPost = async (req, res) => {
  try {
    const { title, text } = req.body;
    const user = await User.findById(req.userId);

    let fileName = ''

    if (req.files) {
      const __dirname = dirname(fileURLToPath(import.meta.url));
      fileName = Date.now().toString() + req.files.image.name;
      req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName))
    }

    const newPost = new Post({
      title,
      text,
      username: user.username,
      author: req.userId,
      imageUrl: fileName,
    })
    console.log(newPost)

    await newPost.save();
    await User.findByIdAndUpdate(req.userId, {
      $push: { posts: newPost },
    })

    return res.send(newPost);

  } catch (error) {
    console.log(error)
    return res.send({ message: 'Can\'t create post :(' })
  }
};

// Get All Posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort('-createdAt')
    const popularPosts = await Post.find().sort('-views');

    if (!posts) {
      return res.send({ message: 'There are no posts' })
    }

    return res.send({ posts, popularPosts })
  } catch (error) {
    console.log(error)
    return res.send({
      message: 'Can\'t load posts :('
    })
  }
}

// Get Post By ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 }
    });

    return res.send({ post })

  } catch (error) {
    console.log(error)
    return res.send({ message: 'Can\'t load  this post' })
  }
}

// Get My Posts
export const getMyPosts = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const userPosts = await Promise.all(
      user.posts.map(post => Post.findById(post._id))
    );

    res.send(userPosts.reverse());
  } catch (error) {
    console.log(error)
    return res.send({ message: 'Can\'t load  user post' })
  }
}

// Remove post
export const removePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.send({ message: 'Post doesn\'t exist' });
    }

    await User.findByIdAndUpdate(req.userId, {
      $pull: { posts: req.params.id }
    });

    return res.send({ post, message: 'Post was deleted' })
  } catch (error) {
    console.log(error)
    return res.send({ message: 'Can\'t delete post' })
  }
}

// Update post
export const updatePost = async (req, res) => {
  try {
    console.log('HERE1', req.params);
    const post = await Post.findById(req.params.id);
    console.log('HERE2', post);
    if (!post) {
      return res.send({ message: 'Post doesn\'t exist' });
    }

    const { title, text } = req.body;

    if (req.files) {
      const __dirname = dirname(fileURLToPath(import.meta.url));
      post.imageUrl = Date.now().toString() + req.files.image.name;
      req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName))
    }

    post.title = title;
    post.text = text;

    await post.save()

    return res.send({ post, message: 'Post was updated' })
  } catch (error) {
    console.log(error)
    return res.send({ message: 'Can\'t update post' })
  }
}

// Get post comments
export const getPostComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const comments = await Promise.all(post.comments.map(commentId => (
      Comment.findById(commentId).then(async (comment) => {
        const author = await User.findById(comment?.author);
        comment.author = author;
        return comment;
      })
    )));
    return res.send(comments);
  } catch (error) {
    console.log(error);

    res.send({
      message: 'Can\'t load post comments',
    })
  }
}