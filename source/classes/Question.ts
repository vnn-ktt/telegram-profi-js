import { Random } from "random-js";
import {
    TQuestionsByLevel,
    IQuestionAnswer,
    IQuestionClick,
    EQuestionType
} from "../types/questions";
import data from '../database/questions';

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
            throw new Error(`⚠️ No questions found for level: ${level}`);
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

    public getQuestionsCount(level: string) : number {
        const levelKey = level.toLowerCase() as keyof TQuestionsByLevel;
        return this._data[levelKey]?.length;
    }
}