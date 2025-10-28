import { Router } from 'express';
import {
  getChatMessages,
  sendMessage,
  updateMessage,
  getLatestMessages
} from '../controllers/messageController.js';

const router = Router();

router.get('/:chatId', getChatMessages);
router.post('/:chatId', sendMessage);
router.put('/update/:messageId', updateMessage);
router.get('/:chatId/latest', getLatestMessages);

export default router;