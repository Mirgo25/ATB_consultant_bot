import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from './env';
import { TelegrafConfigService } from './config/telegraf.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvPath(),
    }),
    TelegrafModule.forRootAsync({
      useClass: TelegrafConfigService,
      inject: [ConfigModule],
      imports: [ConfigModule]
    }),
  ],
  providers: [AppUpdate, AppService, TelegrafConfigService],
})
export class AppModule {}
