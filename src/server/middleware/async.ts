import { Request, Response, NextFunction } from 'express';

export function asyncMiddleware(cb: Function) {
  return function(req: Request, res: Response, next: NextFunction): void {
    cb(req, res, next).catch(next);
  };
}
