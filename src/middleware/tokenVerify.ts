import { Request, Response, NextFunction } from "express";

export default function tokenVerify (req: Request, res: Response, next: NextFunction) {
    const cookie = req.cookies['token'];
    console.log(cookie);

    if (!cookie) {
      return res.status(401).json({ error: "Usuário deslogado" });
    }

    next();
}