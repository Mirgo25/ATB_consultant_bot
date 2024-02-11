import { AppService } from './app.service';
import { Context, Telegraf } from 'telegraf';
import {
  InjectBot,
  Start,
  TextLink,
  Update,
  TextMention,
  Action,
  On,
  Url,
  Message,
  Ctx,
} from 'nestjs-telegraf';
import axios, { AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import { NotFoundException } from '@nestjs/common';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async getHello(ctx: Context) {
    await ctx.reply('Hi, Friend!');
  }
  // https://vm.tiktok.com/ZIJnS8CgJ
  // https://www.tiktok.com/@mcgregor_millionaire/video/7306885065437482273?_r=1&_t=8icn5CUJdSq
  @Url(new RegExp('https://vm.tiktok.com/'))
  async getTikTokLink(@Message('text') link: string, @Ctx() ctx: Context) {
    console.log({ link });
    // const headers: RawAxiosRequestHeaders = {
    //   'User-Agent':
    //     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
    // };
    const { request }: { request: { path: string } } = await axios.get(link);
    if (!request) {
      await ctx.reply('Something wrong with link you have sent');
      throw new NotFoundException('Request not found');
    }

    const userName = request.path.match(/^\/(@\w+)/)[1];
    const videoId = request.path.match(/\/video\/(\d+)/)[1];

    console.log({userName})
    console.log({videoId})

    await ctx.reply('Good!');
  }
}
