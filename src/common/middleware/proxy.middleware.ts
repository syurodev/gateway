import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const projectId = req.headers['projectid'];

    if (!projectId) {
      return res.status(400).send({ error: 'projectid is required' });
    }

    // Ánh xạ projectId với các URL đích
    const targetMap: Record<string, string> = {
      // '3002': 'http://novel.wibutime.svc.cluster.local',
      '3002': 'http://localhost:3002',
    };

    const target: string = targetMap[projectId as string];

    if (!target) {
      return res.status(404).send({ error: 'projectid invalid' });
    }

    // Tạo proxy middleware
    const proxy = createProxyMiddleware({
      target,
      changeOrigin: true,
      proxyTimeout: 60000,
      secure: false,
      on: {
        proxyReq: fixRequestBody,
      },
    });

    // Xử lý lỗi thủ công
    await proxy(req, res, (proxyErr: any) => {
      if (proxyErr) {
        Logger.error('Proxy error:', proxyErr.message);
        return res.status(500).send({ error: 'Proxy error occurred' });
      }
      next();
    });
  }
}
