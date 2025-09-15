import { EQuestionType } from "./questions";

export interface IAnswerReply {
    questionId: number;
    type: EQuestionType.ANSWER;
    answer: string;
}

export interface IOptionReply {
    questionId: number;
    type: EQuestionType.CLICK;
    isCorrect: boolean;
}