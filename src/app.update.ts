import { Context, Markup } from 'telegraf';
import { underline, bold } from 'telegraf/format';
import { Update, On } from 'nestjs-telegraf';
import { getRegionsInlineKeyboard } from './consts/regions';
import { ConfigService } from '@nestjs/config';
import {
  CHOOSE_REGION,
  CONFIRM,
  CONFIRM_YOU_ARE_NOT_ROBOT,
} from './consts/captions';
import { setTimeout as sleep } from 'timers/promises';
import { Logger } from '@nestjs/common';

@Update()
export class AppUpdate {
  logger = new Logger('TelegramBot');

  constructor(private readonly configService: ConfigService) {}

  @On('chat_join_request')
  async new_member_in_chat(ctx: Context) {
    const myRegionChannelLink = this.configService.getOrThrow(
      'MY_REGION_CHANNEL_LINK',
    );
    const { reply_markup } = getRegionsInlineKeyboard(myRegionChannelLink);
    const approveChannelLink = this.configService.getOrThrow(
      'APPROVE_CHANNEL_LINK',
    );
    const { user_chat_id } = ctx.chatJoinRequest;
    try {
      await ctx.telegram.sendPhoto(
        user_chat_id,
        {
          source: 'static/photos/ATB_logo.jpg',
        },
        {
          caption: underline(bold(CHOOSE_REGION)),
          reply_markup,
        },
      );
      await sleep(8000);
      await ctx.telegram.sendMessage(
        user_chat_id,
        bold(CONFIRM_YOU_ARE_NOT_ROBOT),
        {
          reply_markup: Markup.inlineKeyboard([
            Markup.button.url(CONFIRM, approveChannelLink),
          ]).reply_markup,
        },
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  // // https://vm.tiktok.com/ZIJnS8CgJ
  // // https://www.tiktok.com/@mcgregor_millionaire/video/7306885065437482273?_r=1&_t=8icn5CUJdSq
  // @Url(new RegExp('https://vm.tiktok.com/'))
  // async getTikTokLink(@Message('text') link: string, @Ctx() ctx: Context) {
  //   console.log({ link });
  //   // const headers: RawAxiosRequestHeaders = {
  //   //   'User-Agent':
  //   //     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
  //   // };
  //   const { request }: { request: { path: string } } = await axios.get(link);
  //   if (!request) {
  //     await ctx.reply('Something wrong with link you have sent');
  //     throw new NotFoundException('Request not found');
  //   }

  //   const userName = request.path.match(/^\/(@\w+)/)[1];
  //   const videoId = request.path.match(/\/video\/(\d+)/)[1];

  //   console.log({userName})
  //   console.log({videoId})

  //   await ctx.reply('Good!');
  // }
}
