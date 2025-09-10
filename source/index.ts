import {Bot, Keyboard, InlineKeyboard, GrammyError, HttpError} from 'grammy';
import * as dotenv from 'dotenv';

//Configure Bot
dotenv.config();
const bot = new Bot(process.env.BOT_TOKEN!); // "!" говорит, что значение точно есть

//Start Bot
bot.start().then(r => r);

//Commands
bot.command("start", async (ctx) => {
    const startKeyboard = new Keyboard()
        .text("HTML")
        .text("CSS")
        .row()
        .text('JavaScript')
        .text('React')
        .resized();

    await ctx.reply(
        "Привет! Я — Профиджей, Javascript-интервьюер🤖\n" +
        "Я помогу тебе подготовиться к собеседованию на работу."
    );

    await ctx.reply(
        "С чего начнём? Выбери тему вопроса в меню 👇",
        { reply_markup: startKeyboard }
    );
})

//Hears
bot.hears(
    ["HTML", "CSS", "JavaScript", "React"],
    async (ctx) => {
        const replyInlineKeyboard = new InlineKeyboard()
            .text('Получить ответ', 'getAnswer')
            .text('Отменить', 'cancel');
        await ctx.reply(
            `Что такое ${ctx.message!.text}?`,
            { reply_markup: replyInlineKeyboard }
        );
    }
);

//Errors
bot.catch((botError) => {
    const ctx = botError.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const error = botError.error;
    if (error instanceof GrammyError) {
        console.error('Error in request:', error.description);
    } else if (error instanceof HttpError) {
        console.error('Could not contact Telegram:', error);
    } else {
        console.error('Unknown error:', error);
    }
});
