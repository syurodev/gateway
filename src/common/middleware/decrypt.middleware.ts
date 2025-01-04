import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AESEncryption } from '@syurodev/ts-common';

@Injectable()
export class DecryptMiddleware implements NestMiddleware {
  private aesEncryption: AESEncryption;

  constructor() {
    // Khởi tạo EncryptionService với secretKey, thay đổi giá trị này cho phù hợp
    this.aesEncryption = new AESEncryption('your-secret-key');
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (req.body && typeof req.body === 'string') {
      try {
        // Giải mã dữ liệu body từ client
        req.body = this.aesEncryption.decrypt(req.body);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Xử lý trường hợp giải mã thất bại
        return res.status(400).send({ error: 'Dữ liệu mã hóa không hợp lệ' });
      }
    }

    next();
  }
}
