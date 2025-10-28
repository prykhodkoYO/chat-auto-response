import { Router } from 'express';
import {
  getAllChats,
  getChatById,
  createChat,
  updateChat,
  deleteChat
} from '../controllers/chatController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getAllChats);
router.get('/:id', getChatById);
router.post('/', optionalAuth, createChat);
router.put('/:id', updateChat);
router.delete('/:id', deleteChat);

export default router;