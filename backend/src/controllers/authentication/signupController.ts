import { Request, Response, NextFunction } from 'express';
import { authBodyValidator } from './authBodyValidator';
import { User } from '../../models/User';

export const signupController = async (req: Request, res: Response, next:NextFunction) => {
  const { username, email, password } = authBodyValidator.parse(req.body);


  try {
    //rever uso de Promise.all para simplificar código
    const user = await User.findOne({
      email: email,
    });
    if(user){
        throw new Error('a user with this email already exists');
    }

    const user1 = await User.findOne({
      username: username,
    });
    if(user1){
        throw new Error(`The username ${username} is taken`);
    }

    //falta hashear contraseña y guardar usuario
  } catch (error) {
    next(error)
  }

  res.status(201).json({
    content: 'Usuario registrado correctamente',
  });
};