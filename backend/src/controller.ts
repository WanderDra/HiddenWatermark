import { NextFunction, Request, Response, Router } from 'express';

const {spawn} = require('child_process');

export const router: Router = Router();

router.get('/product', async function (req: Request, res: Response, next: NextFunction) {
    try {
    //   const repository = await getProductRepository();
    //   const allProducts = await repository.find();
    //   res.send(allProducts);
    const python = spawn('python', ['PythonCode/image_deal.py']);
    }
    catch (err) {
      return next(err);
    }
  });