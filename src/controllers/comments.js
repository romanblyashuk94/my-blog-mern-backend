import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

// Create Comment
export const createComment = async (req, res) => {
  try {
    const { postId, comment } = req.body;

    if (!comment) {
      return res.send({ message: 'Comment can\'t be empty' })
    }

    const author = await User.findById(req.userId);

    const newComment = new Comment({ comment, author, postId });

    await newComment.save();

    try {
      await Post.findByIdAndUpdate(postId, {
        $push: { comments: newComment._id },
      })

      return res.send({ newComment })
    } catch (error) {
      console.log(error);
      return res.send({ message: 'Can\'t add comment to post' })
    }

  } catch (error) {
    console.log(error)
    return res.send({ message: 'Can\'t add comment :(' })
  }
};

// Remove Comment
export const removeComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);

    if (!comment) {
      return res.send({ message: 'Comment doesn\'t exist' });
    }

    await Post.findByIdAndUpdate(comment.postId, {
      $pull: { comments: req.params.id }
    })

    return res.send({ comment, message: "Comment was removed" })
  } catch (error) {
    console.log(error)
    return res.send({ message: 'Can\'t remove comment :(' })
  }
};