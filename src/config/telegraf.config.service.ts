import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafModuleOptions, TelegrafOptionsFactory } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';

const sessions = new LocalSession({ database: 'session_db.json' });

@Injectable()
export class TelegrafConfigService implements TelegrafOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTelegrafOptions(): TelegrafModuleOptions {
    return {
      token: this.configService.getOrThrow('BOT_TOKEN'),
      middlewares: [sessions.middleware()],
    };
  }
}
