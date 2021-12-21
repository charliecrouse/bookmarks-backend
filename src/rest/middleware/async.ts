import { Request, Response, NextFunction } from 'express';

export const wrapAsync =
  (cb: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request | AuthenticatedRequest, res: Response, next: NextFunction): void => {
    cb(req, res, next).catch(next);
  };
