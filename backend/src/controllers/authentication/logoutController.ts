import { Request, Response } from 'express';

export const logoutController = async (req: Request, res: Response) => {
    res.status(200).json({
        message: 'La sesión se ha cerrado con éxito',
    });
};
