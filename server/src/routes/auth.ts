import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      res.status(400).json({ error: 'Token is required' });
      return;
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
      res.status(400).json({ error: 'Invalid Google token' });
      return;
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email || !name) {
      res.status(400).json({ error: 'Missing required user information' });
      return;
    }

    let user = await User.findOne({ googleId });
    
    if (!user) {
      user = await User.findOne({ email });
      
      if (user) {
        user.googleId = googleId;
        user.name = name;
        user.avatar = picture;
        await user.save();
      } else {
        user = new User({
          googleId,
          email,
          name,
          avatar: picture,
          isGuest: false
        });
        await user.save();
      }
    } else {
      user.name = name;
      user.avatar = picture;
      await user.save();
    }

    const authToken = generateToken(user._id.toString());

    res.json({
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isGuest: user.isGuest
      }
    });

  } catch (error) {
    res.status(400).json({ error: 'Invalid Google token' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.json({ user: null });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.json({ user: null });
      return;
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isGuest: user.isGuest
      }
    });

  } catch (error) {
    res.json({ user: null });
  }
});

export default router;