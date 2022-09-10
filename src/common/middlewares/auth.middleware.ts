import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/user/user.service';
import { verifyJwt } from 'src/utils/helpers/auth.helpers';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Token missing or invalid' });
    }
    const user = await this.decodeToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  }

  extractToken(req) {
    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7);
    }
  }

  async decodeToken(token) {
    const decoded = await verifyJwt(token);
    if (decoded && decoded.sub) {
      return this.userService.findById(decoded.sub);
    }
  }
}
