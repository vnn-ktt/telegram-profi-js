// TODO: 1. Вынести данные в Redis / MongoDB
// TODO: 2. Создать базу знаний для Junior Javascript

import { Bot, Keyboard, InlineKeyboard, GrammyError, HttpError } from 'grammy';
import EnvironmentManager from "./classes/EnvironmentManager.js";
import QuestionManager from "./classes/QuestionManager.js";
import { EGrade } from "./types/questions.js";
import * as utils from "./utils/utils.js";
import {IOptionData, IAnswerData} from "./types/replies.js";

//config app
const BOT_TOKEN = EnvironmentManager.getInstance().getVariable("BOT_TOKEN");
const bot = new Bot(BOT_TOKEN); // "BOT_TOKEN!" - "!" говорит, что значение точно есть
const questionManager = new QuestionManager();

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
        "Сейчас в базе данных бота " + questionManager.getQuestionsCountByGrade() + " вопросов!"
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
        const grade = ctx.message!.text! as keyof typeof EGrade;
        const questionData = questionManager.getRandomQuestion(grade!);
        let inlineKeyboard = new InlineKeyboard();

        // использование type guards упростит проверку типов для таких случаев
        if (questionManager.isClickQuestionType(questionData)) {
            questionData.options.forEach(option => {
                console.log(option);
                const data: IOptionData = {
                    grade: grade,
                    questionId: questionData.id,
                    isCorrect: option.isCorrect
                };
               inlineKeyboard.text(
                   option.text!,
                   JSON.stringify(data)
               ).row();
            });
        } else if (questionManager.isAnswerQuestionType(questionData)) {
            const data: IAnswerData = {
                grade: grade,
                questionId: questionData.id
            };
           inlineKeyboard.text(
                "Узнать ответ",
               JSON.stringify(data)
           );
        }
        await ctx.reply(
            questionData.text,
            { reply_markup: inlineKeyboard }
        );
    }
);

//on handlers
bot.on("callback_query:data", async (ctx) => {
    try {
        const {grade, questionId, ...rest} = JSON.parse(ctx.callbackQuery.data);
        const questionData = questionManager.getQuestionById(grade, questionId);

        if (questionManager.isClickQuestionType(questionData)) {
            if (!rest.isCorrect) {
                await ctx.reply("Вы ответили неверно ❌");
                await ctx.reply(
                    "Правильный ответ:\n" +
                    questionManager.getQuestionAnswer(grade, questionId),
                    { parse_mode: 'HTML' }
                );
            } else if (rest.isCorrect) {
                await ctx.reply("Вы ответили верно ✅");
            }
        } else if (questionManager.isAnswerQuestionType(questionData)) {
            await ctx.reply(
                questionManager.getQuestionAnswer(grade, questionId),
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
