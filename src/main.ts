import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppExceptionsFilter } from './common/filters/app.exception.filter';
import envVars from './config/env.config';
import { logger, loggerMiddleware } from './utils/logger';

const { port } = envVars();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.use(loggerMiddleware);
  app.useGlobalFilters(new AppExceptionsFilter(httpAdapter));

  await app.listen(port, () => logger.info(`Listening on port:${port}`));
}
bootstrap();
