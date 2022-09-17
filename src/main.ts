import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppExceptionsFilter } from './common/filters/app.exception.filter';
import envVars from './config/env.config';
import { logger, loggerMiddleware } from './utils/logger';

const { port } = envVars();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  const config = new DocumentBuilder()
    .setTitle('Inventrie')
    .setDescription('Inventrie API description')
    .setVersion('1.0')
    .addTag('inventory')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.use(loggerMiddleware);
  app.useGlobalFilters(new AppExceptionsFilter(httpAdapter));

  await app.listen(port, () => logger.info(`Listening on port:${port}`));
}
bootstrap();
