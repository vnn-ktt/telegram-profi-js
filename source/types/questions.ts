export enum EGrade {
  JUNIOR = "JUNIOR",
  MIDDLE = "MIDDLE",
  SENIOR = "SENIOR",
}

export enum EQuestionType {
  CLICK = "CLICK",
  ANSWER = "ANSWER",
}

export interface IQuestionAnswer {
  id: number;
  type: EQuestionType.ANSWER;
  grade: EGrade;
  text: string;
  hasOptions: boolean;
  answer: string;
}

export interface IQuestionOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface IQuestionClick {
  id: number;
  type: EQuestionType.CLICK;
  grade: EGrade;
  text: string;
  hasOptions: boolean;
  options: IQuestionOption[];
}

export type TQuestion = IQuestionAnswer | IQuestionClick;

export type TQuestionsByGrade = Record<EGrade, TQuestion[]>;
