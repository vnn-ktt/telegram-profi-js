import {Random} from "random-js";
import {
    EGrade,
    EQuestionType,
    IQuestionAnswer,
    IQuestionClick,
    TQuestionsByGrade,
    TQuestion
} from "../types/questions.js";
import data from '../database/questions.js';

export default class QuestionManager {
    private readonly _data: TQuestionsByGrade;
    private readonly _random: Random;

    constructor (){
        this._data = data;
        this._random = new Random();
    }

    public getRandomQuestion(
        grade: string
    ): IQuestionAnswer | IQuestionClick {
        const gradeKey = grade.toLowerCase() as keyof TQuestionsByGrade;
        if (!this._data[gradeKey]) {
            throw new Error(`❌ No questions found for grade: ${grade}`);
        }
        const randomQuestionIndex = this._random.integer(
            0,
            data[gradeKey].length - 1
        );
        return data[gradeKey][randomQuestionIndex];
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

    public getQuestionsCountByGrade(grade: string = EGrade.JUNIOR) : number {
        const gradeKey = grade.toLowerCase() as keyof TQuestionsByGrade;
        return this._data[gradeKey]?.length;
    }

    public getQuestionAnswer(grade: string = EGrade.JUNIOR, questionId: number): string {
        const gradeKey = grade.toLowerCase() as keyof TQuestionsByGrade;
        const question = this._data[gradeKey].find(quest => quest.id === questionId)!;
        if (this.isAnswerQuestionType(question)) {
            return question.answer;
        } else if (this.isClickQuestionType(question)) {
            return question.options.find(option => option.isCorrect)!.text;
        } else {
            throw new Error('❌ No questions found for grade: ' + grade);
        }
    }

    public getQuestionById(grade: string = EGrade.JUNIOR, id: number): TQuestion {
        const gradeKey = grade.toLowerCase() as keyof TQuestionsByGrade;
        return this._data[gradeKey][id];
    }
}