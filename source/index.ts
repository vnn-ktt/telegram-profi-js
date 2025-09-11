// TODO: 1. Сделать текстовый ответ на вопрос
// TODO: 2. Сделать ответ на вопрос по кнопкам
// TODO: 3. Сделать класс Randomizer
// TODO: 4. Вынести данные в Redis / MongoDB
// TODO: 5. Создать базу знаний для Junior Javascript

import {Bot, Keyboard, InlineKeyboard, GrammyError, HttpError} from 'grammy';
import EnvironmentManager from "./classes/EnvironmentManager.js";
import {getRandomQuestion} from "./classes/Randomizer.js";

//Configure Bot
EnvironmentManager.getInstance();
const BOT_TOKEN = EnvironmentManager.getInstance().getVariable("BOT_TOKEN");
const bot = new Bot(BOT_TOKEN); // "BOT_TOKEN!" - "!" говорит, что значение точно есть

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
        const topic = ctx.message!.text;
        const question = getRandomQuestion(topic!);

        const replyInlineKeyboard = new InlineKeyboard()
            .text(
                'Получить ответ',
                JSON.stringify({
                    messageText: ctx.message!.text,
                    question: question.answer,
                    questionId: question.id
                })
            )
            .text('Отменить', 'cancel');
        await ctx.reply(
            `Что такое ${ctx.message!.text}?`,
            { reply_markup: replyInlineKeyboard }
        );
    }
);

//On
bot.on("callback_query:data", async (ctx) => {
    if(ctx.callbackQuery.data === "cancel"){
        await ctx.reply("Отмена");
        await ctx.answerCallbackQuery();
        return;
    }

    const callbackData = JSON.parse(ctx.callbackQuery.data);
    await ctx.reply(`${callbackData.messageText} – это составляющая фронтенда.`);
    await ctx.answerCallbackQuery();
});

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
