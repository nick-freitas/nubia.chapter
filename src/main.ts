import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'chapter',
          // brokers: ['kafka1-service:9091','kafka2-service:9092','kafka3-service:9093','kafka4-service:9094','kafka5-service:9095','kafka6-service:9096'],
          brokers: ['kafka2-service:9092'],
        },
        consumer: {
          groupId: 'chapter-consumer',
        },
      },
    },
  );

  app.listen();
}
bootstrap();
