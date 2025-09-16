import { EGrade } from "./questions.js";

export interface IAnswerData {
    grade: keyof typeof EGrade;
    questionId: number;
}

export interface IOptionData {
    grade: keyof typeof EGrade;
    questionId: number;
    isCorrect: boolean;
}