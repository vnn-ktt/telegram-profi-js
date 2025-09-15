// TODO: 1. Вынести данные в Redis / MongoDB
// TODO: 2. Создать базу знаний для Junior Javascript

import { Bot, Keyboard, InlineKeyboard, GrammyError, HttpError } from 'grammy';
import EnvironmentManager from "./classes/EnvironmentManager.js";
import Question from "./classes/Question.js";
import { EGrade, EQuestionType } from "./types/questions.js";
import * as utils from "./utils/utils.js";

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
        "Сейчас в базе данных бота " + question.getQuestionsCountByLevel() + " вопросов!"
    );

    await ctx.reply(
        "Выбери сложность вопроса в меню 👇",
        { reply_markup: startKeyboard }
    );
})

//hears
bot.hears(
    [
        utils.capitalize(EGrade.JUNIOR),
        utils.capitalize(EGrade.MIDDLE),
        utils.capitalize(EGrade.SENIOR)
    ],
    async (ctx) => {
        const grade = ctx.message!.text;
        const data = question.getRandomQuestion(grade!);
        let inlineKeyboard = new InlineKeyboard();

        // использование type guards упростит проверку типов для таких случаев
        if (question.isClickQuestionType(data)) {
            data.options.forEach(option => {
               inlineKeyboard.text(
                   option.text!,
                   JSON.stringify({
                       level: grade,
                       questionId: data.id,
                       type: data.type,
                       isCorrect: option.isCorrect
                   })
               ).row();
            });
        } else if (question.isAnswerQuestionType(data)) {
           inlineKeyboard.text(
                "Узнать ответ",
                JSON.stringify({
                    level: grade,
                    questionId: data.id,
                    type: data.type,
                    answer: data.answer
                })
           );
        }
        await ctx.reply(
            data.text,
            { reply_markup: inlineKeyboard }
        );
    }
);

//on handlers
bot.on("callback_query:data", async (ctx) => {
    try {
        const callbackData = JSON.parse(ctx.callbackQuery.data);
        if (callbackData.type === EQuestionType.CLICK) {
            if (callbackData.isCorrect) {
                await ctx.reply("Вы ответили неверно ❌");
                await ctx.reply(
                    "Правильный ответ:\n" +
                    question.getQuestionAnswer(callbackData.level, callbackData.questionId),
                    { parse_mode: 'HTML' }
                );
            } else if (!callbackData.isCorrect) {
                await ctx.reply("Вы ответили верно ✅");
            }
        } else if (callbackData.type === EQuestionType.ANSWER) {
            await ctx.reply(
                question.getQuestionAnswer(callbackData.level, callbackData.questionId),
                { parse_mode: 'HTML' }
            );
        }
        await ctx.answerCallbackQuery();
    } catch (error) {
        throw error;
    }
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
