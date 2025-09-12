// TODO: 1. Сделать текстовый ответ на вопрос
// TODO: 2. Сделать ответ на вопрос по кнопкам
// TODO: 3. Сделать класс Randomizer
// TODO: 4. Вынести данные в Redis / MongoDB
// TODO: 5. Создать базу знаний для Junior Javascript

import { Bot, Keyboard, InlineKeyboard, GrammyError, HttpError } from 'grammy';
import EnvironmentManager from "./classes/EnvironmentManager.js";
import Question from "./classes/Question.js";
import { EGrade } from "./types/questions";

//config app
const BOT_TOKEN = EnvironmentManager.getInstance().getVariable("BOT_TOKEN");
const bot = new Bot(BOT_TOKEN); // "BOT_TOKEN!" - "!" говорит, что значение точно есть
const question = new Question();

//start Bot
bot.start().then(r => r);

//commands
bot.command("start", async (ctx) => {
    const startKeyboard = new Keyboard()
        .text("Junior")
        .text("Middle")
        .text('Senior')
        .resized();

    await ctx.reply(
        "Привет! Я — Профиджей, Javascript-интервьюер🤖\n" +
        "Я помогу тебе подготовиться к собеседованию на работу."
    );

    await ctx.reply(
        "Выбери сложность вопроса в меню 👇",
        { reply_markup: startKeyboard }
    );
})

//hears
bot.hears(
    [
        EGrade.JUNIOR.toUpperCase(),
        EGrade.MIDDLE.toUpperCase(),
        EGrade.SENIOR.toUpperCase()
    ],
    async (ctx) => {
        const grade = ctx.message!.text;
        const data = question.getRandomQuestion(grade!);
        let inlineKeyboard = new InlineKeyboard();

        // использование type guards упростит проверку типов для таких случаев
        if (question.isClickQuestionType(data)) {
            const buttonRows =
                data.options.map(
                    (option) => [
                        InlineKeyboard
                            .text(
                                option.text!,
                                JSON.stringify(
                                    {
                                        type: `${grade}-option`,
                                        isCorrect: option.isCorrect,
                                        questionId: data.id
                                    }
                                )
                            )
                    ]
                );
            inlineKeyboard = InlineKeyboard.from(buttonRows);
        } else if (question.isAnswerQuestionType(data)) {
           inlineKeyboard
                .text(
                    "Узнать ответ",
                    JSON.stringify({
                        messageText: ctx.message!.text,
                        answer: data.answer,
                        questionId: data.id
                    })
                )
        }
        await ctx.reply(
            data.text,
            { reply_markup: inlineKeyboard }
        );
    }
);

//on handlers
bot.on("callback_query:data", async (ctx) => {
    const callbackData = JSON.parse(ctx.callbackQuery.data);
    //TODO: Доделать ответ на вопрос
});

//errors
bot.catch((botError) => {
    const ctx = botError.ctx;
    console.error(`❌ Error while handling update ${ctx.update.update_id}:`);
    const error = botError.error;
    if (error instanceof GrammyError) {
        console.error('❌ Error in request:', error.description);
    } else if (error instanceof HttpError) {
        console.error('❌ Could not contact Telegram:', error);
    } else {
        console.error('❌ Unknown error:', error);
    }
});
