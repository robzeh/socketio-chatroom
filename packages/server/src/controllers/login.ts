import express, { Request, Response } from 'express';

const loginRouter = express.Router();

loginRouter.post('/', async (req: Request, res: Response) => {
  const userDetails = req.body;
  // returning user
  if (userDetails.session) {

  }
})