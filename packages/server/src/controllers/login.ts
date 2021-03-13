import express, { Request, Response } from 'express';
import { sessionStore } from '../stores/stores';
import { UserSession } from '../types';

const loginRouter = express.Router();

loginRouter.post('/', async (req: Request, res: Response) => {
  const userDetails: UserSession = req.body;
  // returning user
  if (userDetails.sessionId) {
    const session = await sessionStore.findSession(userDetails.sessionId);
    if (session) {
      return res.status(200).send({
        username: session.username,
        sessionId: userDetails.sessionId,
        roomId: session.roomId,
      });
    }
  }

  // new user
  return res.status(200).send({
    username: userDetails.username,
    sessionId: userDetails.sessionId,
    roomId: userDetails.roomId,
  });

});

export { loginRouter };