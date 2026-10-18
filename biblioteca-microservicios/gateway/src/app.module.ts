import { Module } from '@nestjs/common';

// El gateway no tiene controllers: todo el trabajo ocurre en los middlewares de main.ts
@Module({})
export class AppModule {}
