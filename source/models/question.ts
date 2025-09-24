import mongoose, { Schema } from "mongoose";
import {
  EGrade,
  EQuestionType,
  IQuestionOption,
  TQuestion,
} from "../types/questions.js";

const QuestionOptionSchema = new Schema<IQuestionOption>(
  {
    id: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { _id: false } //no index in click question options
);

const QuestionSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true, //index to fast search by id
    },
    grade: {
      type: String,
      enum: Object.values(EGrade),
      required: true,
      index: true, //index to fast search by grade
    },
    type: {
      type: String,
      enum: Object.values(EQuestionType),
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    hasOptions: {
      type: Boolean,
      required: true,
    },
    //for type answer questions
    answer: {
      type: String,
      required: function (this: TQuestion): boolean {
        return this.type === EQuestionType.ANSWER && !this.hasOptions;
      },
      trim: true,
    },
    //for type click questions
    options: {
      type: [QuestionOptionSchema],
      required: function (this: TQuestion): boolean {
        return this.type === EQuestionType.CLICK && this.hasOptions;
      },
    },
  },
  {
    timestamps: true, //auto createdAt and updatedAt
    collection: "questions",
  }
);

//optimize queries
QuestionSchema.index({ grade: 1, type: 1 });
QuestionSchema.index({ id: 1 }, { unique: true });

// Статические методы для удобства работы
QuestionSchema.statics.findByGrade = function (grade: EGrade) {
  return this.find({ grade, isActive: true });
};

QuestionSchema.statics.findByGradeAndType = function (
  grade: EGrade,
  type: EQuestionType
) {
  return this.find({ grade, type, isActive: true });
};
export const Question = mongoose.model<TQuestion>("Question", QuestionSchema);
