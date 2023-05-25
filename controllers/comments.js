import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// Create Comment
export const createComment = async (req, res) => {
  try {
    const { postId, comment } = req.body;

    if (!comment) {
      return res.send({ message: 'Comment can\'t be empty' })
    }

    const newComment = new Comment({ comment, author: req.userId });

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