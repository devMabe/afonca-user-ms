import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { TokenData } from 'src/users/model/User';
import { decodeJwt } from 'src/utils/security';

interface RequestExtends extends Request {
  user?: TokenData | JwtPayload;
}

@Injectable()
export class CheckJwt implements NestMiddleware {
  use(req: RequestExtends, res: Response, next: NextFunction) {
    let token = req.headers.authorization;

    if (token) {
      try {
        const jwtToken = token.split(' ').pop()
        const decode = decodeJwt(jwtToken);
        console.log('DECODE', decode);
        req.user = decode;
        next();
      } catch (error) {
        res.status(401).json({ message: 'Token invalido' });
      }
    } else {
      res.status(401).json({ message: 'Token no proporcionado' });
    }
  }
}
