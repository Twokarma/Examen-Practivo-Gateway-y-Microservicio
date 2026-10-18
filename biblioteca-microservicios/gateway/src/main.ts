import { NestFactory } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { rateLimit } from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AppModule } from './app.module';

async function bootstrap() {
  // bodyParser: false -> el body pasa intacto al microservicio (si no, los POST se cuelgan)
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // 1) CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // 2) Logging / tracing centralizado (x-request-id)
  app.use((req: Request, res: Response, next: NextFunction) => {
    const id = (req.headers['x-request-id'] as string) ?? randomUUID();
    req.headers['x-request-id'] = id;
    res.setHeader('x-request-id', id);
    const inicio = Date.now();
    res.on('finish', () => {
      console.log(
        `[${new Date().toISOString()}] ${id} ${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - inicio}ms)`,
      );
    });
    next();
  });

  // 3) Rate limiting: 100 peticiones por minuto por IP
  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: { statusCode: 429, message: 'Demasiadas peticiones, intenta más tarde' },
    }),
  );

  // Health del propio gateway
  app.getHttpAdapter().get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'gateway' });
  });

  // 4) Proxy inverso: todo lo que empiece con /api va al microservicio
  app.use(
    createProxyMiddleware({
      target: process.env.BACKEND_URL ?? 'http://localhost:3001',
      changeOrigin: true,
      pathFilter: '/api',
    }),
  );

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`Gateway escuchando en :${process.env.PORT ?? 3000}`);
}
bootstrap();
