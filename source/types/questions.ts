export enum EGrade {
    JUNIOR = "junior",
    MIDDLE = "middle",
    SENIOR = "senior"
}

export enum EQuestionType {
    CLICK = "click",
    ANSWER = "answer",
}

export interface IQuestionAnswer {
    id: number;
    type: EQuestionType.ANSWER;
    text: string;
    hasOptions: boolean;
    answer: string;
}

export interface IQuestionOption {
    id: number,
    text: string,
    isCorrect: boolean
}

export interface IQuestionClick {
    id: number;
    type: EQuestionType.CLICK;
    text: string;
    hasOptions: boolean,
    options: IQuestionOption[]
}

type TQuestion = IQuestionAnswer | IQuestionClick;

export type TQuestionsByLevel = Record<EGrade, TQuestion[]>;