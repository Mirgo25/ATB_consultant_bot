import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { TelegrafModuleOptions, TelegrafOptionsFactory } from 'nestjs-telegraf';
import { session } from 'telegraf-session-mongodb';

@Injectable()
export class TelegrafConfigService implements TelegrafOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
    @InjectConnection() private readonly connection: Connection,
  ) {}
  createTelegrafOptions(): TelegrafModuleOptions {
    return {
      token: this.configService.getOrThrow('BOT_TOKEN'),
      middlewares: [
        session(this.connection.db, {
          sessionName: 'session',
          collectionName: 'sessions',
        }),
      ],
    };
  }
}
