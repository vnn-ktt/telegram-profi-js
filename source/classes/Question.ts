import {Random} from "random-js";
import {
    EGrade,
    EQuestionType,
    IQuestionAnswer,
    IQuestionClick,
    TQuestionsByLevel
} from "../types/questions.js";
import data from '../database/questions.js';

export default class Question {
    private readonly _data: TQuestionsByLevel;
    private readonly _random: Random;

    constructor (){
        this._data = data;
        this._random = new Random();
    }

    public getRandomQuestion(
        level: string
    ): IQuestionAnswer | IQuestionClick {
        const levelKey = level.toLowerCase() as keyof TQuestionsByLevel;
        if (!this._data[levelKey]) {
            throw new Error(`❌ No questions found for level: ${level}`);
        }
        const randomQuestionIndex = this._random.integer(
            0,
            data[levelKey].length - 1
        );
        return data[levelKey][randomQuestionIndex];
    }

    public isClickQuestionType(
        question: IQuestionAnswer | IQuestionClick
    ) : question is IQuestionClick {
        return question.type === EQuestionType.CLICK;
    }

    public isAnswerQuestionType(
        question: IQuestionAnswer | IQuestionClick
    ) : question is IQuestionAnswer  {
        return question.type === EQuestionType.ANSWER;
    }

    public getQuestionsCountByLevel(level: string = EGrade.JUNIOR) : number {
        const levelKey = level.toLowerCase() as keyof TQuestionsByLevel;
        return this._data[levelKey]?.length;
    }

    public getQuestionAnswer(level: string, questionId: number): string {
        const levelKey = level.toLowerCase() as keyof TQuestionsByLevel;
        const question = this._data[levelKey][questionId];
        if (this.isAnswerQuestionType(question)) {
            return question.answer;
        } else if (this.isClickQuestionType(question)) {
            return question.options.find(option => option.isCorrect)!.text;
        } else {
            throw new Error('❌ No questions found for level: ' + level);
        }
    }
}