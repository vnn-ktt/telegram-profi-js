import { Random } from "random-js";
import {
    EGrade,
    EQuestionType,
    IQuestionAnswer,
    IQuestionClick,
    IQuestionOption,
    TQuestion
} from "../types/questions.js";
import { Question} from "../database/models/question.js";

export default class QuestionManager {
    private readonly _random: Random;

    constructor() {
        this._random = new Random();
    }

    // Основной метод - получение случайного вопроса
    public async getRandomQuestion(grade: string): Promise<IQuestionAnswer | IQuestionClick> {
        const gradeKey = grade.toLowerCase() as EGrade;

        try {
            const randomQuestion = await Question.getRandomQuestion(gradeKey);

            if (!randomQuestion || randomQuestion.length === 0) {
                throw new Error(`❌ No questions found for grade: ${grade}`);
            }

            // Конвертируем Mongoose документ в наш интерфейс
            return this._convertToQuestionInterface(randomQuestion[0]);
        } catch (error) {
            console.error('Error getting random question:', error);
            throw new Error(`❌ Failed to get question for grade: ${grade}`);
        }
    }

    // Получить вопрос по ID
    public async getQuestionById(grade: string, id: number): Promise<TQuestion> {
        try {
            // В MongoDB используем _id вместо числового id
            const question = await Question.findById(id);
            if (!question) {
                throw new Error(`❌ Question not found with id: ${id}`);
            }

            // Проверяем, что вопрос соответствует запрошенному грейду
            if (question.grade.toLowerCase() !== grade.toLowerCase()) {
                throw new Error(`❌ Question grade mismatch`);
            }

            return this._convertToQuestionInterface(question);
        } catch (error) {
            console.error('Error getting question by id:', error);
            throw new Error(`❌ Failed to get question with id: ${id}`);
        }
    }

    // Получить ответ на вопрос
    public async getQuestionAnswer(grade: string, questionId: string): Promise<string> {
        try {
            const question = await Question.findById(questionId);
            if (!question) {
                throw new Error(`❌ Question not found with id: ${questionId}`);
            }

            if (question.grade.toLowerCase() !== grade.toLowerCase()) {
                throw new Error(`❌ Question grade mismatch`);
            }

            if (question.type === EQuestionType.ANSWER) {
                return question.answer;
            } else if (question.type === EQuestionType.CLICK) {
                const correctOption = question.options.find(option => option.isCorrect);
                return correctOption ? correctOption.text : 'No correct option found';
            } else {
                throw new Error('❌ Unknown question type');
            }
        } catch (error) {
            console.error('Error getting question answer:', error);
            throw new Error(`❌ Failed to get answer for question: ${questionId}`);
        }
    }

    // Получить количество вопросов по грейду
    public async getQuestionsCountByGrade(grade: string = EGrade.JUNIOR): Promise<number> {
        try {
            const gradeKey = grade.toLowerCase() as EGrade;
            const count = await Question.countDocuments({
                grade: gradeKey,
                isActive: true
            });
            return count;
        } catch (error) {
            console.error('Error getting questions count:', error);
            return 0;
        }
    }

    // Type guards (остаются без изменений)
    public isClickQuestionType(
        question: IQuestionAnswer | IQuestionClick
    ): question is IQuestionClick {
        return question.type === EQuestionType.CLICK;
    }

    public isAnswerQuestionType(
        question: IQuestionAnswer | IQuestionClick
    ): question is IQuestionAnswer {
        return question.type === EQuestionType.ANSWER;
    }

    // Дополнительные методы для расширенной функциональности
    public async getQuestionsByGrade(grade: string): Promise<TQuestion[]> {
        try {
            const gradeKey = grade.toLowerCase() as EGrade;
            const questions = await Question.find({
                grade: gradeKey,
                isActive: true
            }).sort({ createdAt: -1 });

            return questions.map(q => this._convertToQuestionInterface(q));
        } catch (error) {
            console.error('Error getting questions by grade:', error);
            return [];
        }
    }

    public async getQuestionsByGradeAndType(grade: string, type: EQuestionType): Promise<TQuestion[]> {
        try {
            const gradeKey = grade.toLowerCase() as EGrade;
            const questions = await Question.find({
                grade: gradeKey,
                type: type,
                isActive: true
            });

            return questions.map(q => this._convertToQuestionInterface(q));
        } catch (error) {
            console.error('Error getting questions by grade and type:', error);
            return [];
        }
    }

    public async getRandomQuestionByType(grade: string, type: EQuestionType): Promise<TQuestion> {
        try {
            const gradeKey = grade.toLowerCase() as EGrade;
            const randomQuestion = await Question.getRandomQuestion(gradeKey, type);

            if (!randomQuestion || randomQuestion.length === 0) {
                throw new Error(`❌ No ${type} questions found for grade: ${grade}`);
            }

            return this._convertToQuestionInterface(randomQuestion[0]);
        } catch (error) {
            console.error('Error getting random question by type:', error);
            throw new Error(`❌ Failed to get ${type} question for grade: ${grade}`);
        }
    }

    // Валидация ответа пользователя
    public validateAnswer(question: TQuestion, userAnswer: string | number): boolean {
        if (this.isAnswerQuestionType(question)) {
            // Для текстовых ответов - нормализация и сравнение
            return question.answer.toLowerCase().trim() === userAnswer.toString().toLowerCase().trim();
        } else if (this.isClickQuestionType(question)) {
            // Для кликовых вопросов - проверка выбранного варианта
            if (typeof userAnswer === 'number') {
                const selectedOption = question.options[userAnswer];
                return selectedOption ? selectedOption.isCorrect : false;
            } else if (typeof userAnswer === 'string') {
                // Если пришел текст варианта
                const selectedOption = question.options.find(opt =>
                    opt.text.toLowerCase().trim() === userAnswer.toLowerCase().trim()
                );
                return selectedOption ? selectedOption.isCorrect : false;
            }
        }
        return false;
    }

    // Получить правильные ответы (для нескольких правильных вариантов)
    public getCorrectAnswers(question: TQuestion): string[] {
        if (this.isAnswerQuestionType(question)) {
            return [question.answer];
        } else if (this.isClickQuestionType(question)) {
            return question.options
                .filter(opt => opt.isCorrect)
                .map(opt => opt.text);
        }
        return [];
    }

    // Приватный метод для конвертации Mongoose документа в наш интерфейс
    private _convertToQuestionInterface(mongooseDoc: any): TQuestion {
        const baseQuestion = {
            id: mongooseDoc._id.toString(), // Используем _id как строковый идентификатор
            type: mongooseDoc.type,
            text: mongooseDoc.text,
            hasOptions: mongooseDoc.hasOptions
        };

        if (mongooseDoc.type === EQuestionType.ANSWER) {
            return {
                ...baseQuestion,
                type: EQuestionType.ANSWER,
                answer: mongooseDoc.answer
            } as IQuestionAnswer;
        } else {
            return {
                ...baseQuestion,
                type: EQuestionType.CLICK,
                options: mongooseDoc.options.map((opt: IQuestionOption, index: number) => ({
                    id: index, // Генерируем последовательный id для опций
                    text: opt.text,
                    isCorrect: opt.isCorrect
                }))
            } as IQuestionClick;
        }
    }

    // Метод для миграции старых данных (одноразовый)
    public async migrateFromOldData(oldData: any): Promise<void> {
        try {
            // Преобразуем старую структуру в новую
            const questionsToInsert = [];

            for (const [grade, questions] of Object.entries(oldData)) {
                for (const question of questions as TQuestion[]) {
                    const newQuestion: any = {
                        grade: grade as EGrade,
                        type: question.type,
                        text: question.text,
                        hasOptions: question.hasOptions,
                        topic: 'general', // Можно извлечь из старой структуры или оставить по умолчанию
                        isActive: true
                    };

                    if (question.type === EQuestionType.ANSWER) {
                        newQuestion.answer = (question as IQuestionAnswer).answer;
                    } else {
                        newQuestion.options = (question as IQuestionClick).options.map(opt => ({
                            text: opt.text,
                            isCorrect: opt.isCorrect
                        }));
                    }

                    questionsToInsert.push(newQuestion);
                }
            }

            await Question.insertMany(questionsToInsert);
            console.log(`✅ Successfully migrated ${questionsToInsert.length} questions`);
        } catch (error) {
            console.error('Error during migration:', error);
            throw new Error('❌ Migration failed');
        }
    }
}