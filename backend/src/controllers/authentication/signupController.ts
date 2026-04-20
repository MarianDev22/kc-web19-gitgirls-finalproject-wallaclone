import { Request, Response } from 'express';
import { authBodyValidator } from './authBodyValidator';
import { User } from '../../models/User';

export const signupController = async (req: Request, res: Response) => {
  const { email, password } = authBodyValidator.parse(req.body);


  try {
    const user = await User.findOne({
      email: email,
    //   password: password,
    });
    if(user){
        throw new Error('User already exists');
    }
  } catch (error) {
    res.status(409).json({
      content: 'User must be unique',
    });
  }

  res.status(201).json({
    content: 'Usuario registrado correctamente',
  });
};