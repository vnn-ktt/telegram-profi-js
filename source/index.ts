// TODO: 1. Вынести данные в MongoDB
// TODO: 2. Создать базу знаний для Junior Javascript
// TODO: 3. Доработать Winston Logger
// TODO: 4. Добавить prettier + eslint

import { Bot, Keyboard, InlineKeyboard, GrammyError, HttpError } from 'grammy';
import EnvironmentManager from "./classes/EnvironmentManager.js";
import QuestionManager from "./classes/QuestionManager.js";
import LogManager from "./classes/LogManager.js";
import { EGrade } from "./types/questions.js";
import * as utils from "./utils/utils.js";
import {IOptionData, IAnswerData} from "./types/replies.js";

//configure app
const BOT_TOKEN = EnvironmentManager.getInstance().getVariable("BOT_TOKEN");
const bot = new Bot(BOT_TOKEN); // "BOT_TOKEN!" - "!" говорит, что значение точно есть
const questionManager = new QuestionManager();
const logManager = LogManager.getInstance();
const botLogger = logManager.child({
    module: "telegram-bot"
});
botLogger.info('Application starting', {
    nodeEnv: process.env.NODE_ENV,
    questionsCount: questionManager.getQuestionsCountByGrade()
});

//start bot
bot.start().then(() => {
    botLogger.info("Bot successfully started");
}).catch(error => {
    botLogger.error("Failed to start bot", error);
});

//commands
bot.command("start", async (ctx) => {
    const userId = ctx.from?.id;
    const chatId = ctx.chat?.id;
    try {
        const startKeyboard = new Keyboard()
            .text("Junior")
            .text("Middle")
            .text('Senior')
            .resized();

        botLogger.info('Start command received', { userId, chatId });

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
    } catch (error) {
        botLogger.error("Error in start command", error, {
            userId: userId,
            chatId: chatId
        });
        await ctx.reply(
            "Произошла ошибка. Попробуйте позже"
        );
    }
})

//hears
bot.hears(
    [
        utils.capitalize(EGrade.JUNIOR),
        utils.capitalize(EGrade.MIDDLE),
        utils.capitalize(EGrade.SENIOR)
    ],
    async (ctx) => {
        const userId = ctx.from?.id;
        const chatId = ctx.chat?.id;
        const grade = ctx.message!.text! as keyof typeof EGrade;
        try {
            botLogger.info('Grade selected', { userId, chatId, grade });
            const questionData = questionManager.getRandomQuestion(grade!);
            let inlineKeyboard = new InlineKeyboard();

            // использование type guards упростит проверку типов для таких случаев
            if (questionManager.isClickQuestionType(questionData)) {
                questionData.options.forEach(option => {
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
            botLogger.info('Question sent to user', {
                userId,
                questionId: questionData.id,
                grade
            });
        } catch (error) {
            botLogger.error('Error in grade selection handler', error, {
                userId: userId,
                chatId: chatId,
                grade: grade
            });
            await ctx.reply("Произошла ошибка при получении вопроса.");
        }
    }
);

//on handlers
bot.on("callback_query:data", async (ctx) => {
    const callbackData = JSON.parse(ctx.callbackQuery.data);
    const { grade, questionId, ...rest } = callbackData;
    const userId = ctx.from?.id;
    const chatId = ctx.chat?.id;

    try {
        botLogger.info('Callback query received', {
            userId,
            chatId,
            callbackData: callbackData
        });
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
        botLogger.info('Callback query processed successfully', {
            userId,
            questionId
        });
    } catch (error) {
        botLogger.error('Error processing callback query', error, {
            userId: userId,
            chatId: chatId,
            callbackData: callbackData
        });
        await ctx.answerCallbackQuery({
            text: "Произошла ошибка. Попробуйте еще раз."
        });
    }
});

//errors
bot.catch((botError) => {
    const ctx = botError.ctx;
    const error = botError.error;

    const logContext = {
        updateId: ctx.update.update_id,
        userId: ctx.from?.id,
        chatId: ctx.chat?.id
    };

    botLogger.error(`Error while handling update ${ctx.update.update_id}:`, error, logContext);

    if (error instanceof GrammyError) {
        botLogger.warn('Telegram API error', {
            ...logContext,
            description: error.description,
            errorCode: error.error_code
        });
    } else if (error instanceof HttpError) {
        botLogger.error('HTTP error contacting Telegram', error, logContext);
    } else {
        botLogger.error('Unknown error occurred', error, logContext);
    }
});
