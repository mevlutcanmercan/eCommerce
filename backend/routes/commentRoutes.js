const express = require('express');
const Comment = require('../models/comments');
const upperCategory = require('../models/upperCategory');
const { authenticate, authorizeAdmin } = require('./middlewares/auth');

const router = express.Router();


router.post('/product/:productId/addComment', authenticate, async (req, res) => {
  const productId = req.params.productId;
  const { comment, rate } = req.body;
  const userId = req.user.id;

  try {
    const newComment = new Comment({
      userID: userId,
      comment,
      rate,
      productID: productId,
      approvalStatus: false
    });
    if (!comment || !rate) {
      return res.status(400).json({ error: 'Comment ve rate gereklidir!' });
    }
    
    if (rate < 1 || rate > 5) {
      return res.status(400).json({ error: 'Rate 1 ile 5 arasında olmalıdır!' });
    }
    await newComment.save();
    res.status(201).json({ message: 'Comment Success', newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

router.get('/product/:productId/comments', async (req, res) => {
  const productId = req.params.productId;

  try {
    const comments = await Comment.find({ productID: productId, approvalStatus: true });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

router.put('/comment/:commentId/approve', authenticate, authorizeAdmin, async (req, res) => {
  const commentId = req.params.commentId;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { approvalStatus: true },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(updatedComment);
  } catch (error) {
    console.error('Error approving comment:', error);
    res.status(500).json({ error: 'Failed to approve comment' });
  }
});
!
router.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find().select('-userID');
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

router.delete('/comment/:commentId/delete', authenticate, authorizeAdmin, async (req, res) => {
  const commentId = req.params.commentId;

  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
