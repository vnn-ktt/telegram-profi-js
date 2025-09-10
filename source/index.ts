import { Bot } from 'grammy';
import * as dotenv from 'dotenv';

//Configure Bot
dotenv.config();
const bot = new Bot(process.env.BOT_TOKEN!); // "!" говорит, что значение точно есть

//Start Bot
bot.start().then(r => r);