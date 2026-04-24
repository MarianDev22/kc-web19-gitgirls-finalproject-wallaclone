import { Request, Response, NextFunction } from 'express';
import { authBodyValidator } from './authBodyValidator';
import { User } from '../../models/User';
import { securityService } from './securityService';

export const signupController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = authBodyValidator.parse(req.body);
    const [existingUsername, existingEmail] = await Promise.all([
      User.findOne({ username }),
      User.findOne({ email }),
    ]);

    if (existingUsername)
      return res.status(409).json({ error: `El nombre de usuario ${username} está en uso` });
    if (existingEmail)
      return res.status(409).json({ error: 'Ya exsite un usuario con este email' });

    //hashear contraseña, usuario con password hasheada y guardar usuario
    const hashedPassword = await securityService.hashPassword(password);
    const newUser = new User({ username, email, password: hashedPassword });
    const createdUser = await newUser.save();

    //crear token en caso de que se quiera loguear al usuario automaticamente despues de registrarse
    const newToken = securityService.generateJWT(createdUser._id.toString());

    // respuesta json: user, token y mensaje
    res.status(201).json({
      user: {
        username: createdUser.username,
      },
      token: newToken,
      message: 'Usuario registrado correctamente',
    });
  } catch (error) {
    next(error);
  }
};
