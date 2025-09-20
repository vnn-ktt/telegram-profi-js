// models/Question.model.ts
import { Schema, model } from 'mongoose';
import { IQuestionDocument, EQuestionType } from '../../types/questions.js';

const OptionSchema = new Schema({
    id: { type: Number, required: true },
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
});

const QuestionSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    text: { type: String, required: true },
    type: {
        type: String,
        enum: Object.values(EQuestionType),
        required: true
    },
    hasOptions: { type: Boolean, required: true },
    options: [OptionSchema],
    answer: { type: String },
    grade: {
        type: String,
        enum: ['junior', 'middle', 'senior'],
        required: true
    }
});

export const Question = model<IQuestionDocument>('Question', QuestionSchema);