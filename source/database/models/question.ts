import mongoose, { Schema, Document } from 'mongoose';
import {EGrade, EQuestionType, IQuestionOption, TQuestion} from "../../types/questions.js";

const QuestionOptionSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    isCorrect: {
        type: Boolean,
        required: true,
        default: false
    }
}, {_id: false}); //do not create unique id for options

const QuestionSchema = new Schema({
    grade: {
        type: String,
        enum: Object.values(EGrade),
        required: true,
        index: true //index to fast search by grade
    },
    type: {
        type: String,
        enum: Object.values(EQuestionType),
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    hasOptions: {
        type: Boolean,
        required: true
    },
    answer: {
        type: String,
        required: function(this: any) {
            return this.type === EQuestionType.ANSWER;
        },
        trim: true
    },
    click: {
        type: [QuestionOptionSchema],
        required: function (this: any) {
            return this.type === EQuestionType.CLICK;
        },
        validate: {
            validator:  function(this: any, options: IQuestionOption[]) {
                if (this.type === EQuestionType.CLICK) {
                    return options && options.length >= 2;
                }
                return true;
            },
            message: "Click question must have at least 2 options"
        },
    },
    // additional reqs
    topic: {
        type: String,
        index: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    explanation: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, {
    timestamps: true, //auto createdAt and updatedAt
    collection: 'questions'
});

//optimize queries
QuestionSchema.index({ grade: 1, type: 1 });
QuestionSchema.index({ grade: 1, topic: 1 });
QuestionSchema.index({ grade: 1, isActive: 1 });

// Статические методы для удобства работы
QuestionSchema.statics.findByGrade = function(grade: EGrade) {
    return this.find({ grade, isActive: true });
};

QuestionSchema.statics.findByGradeAndType = function(grade: EGrade, type: EQuestionType) {
    return this.find({ grade, type, isActive: true });
};

QuestionSchema.statics.getRandomQuestion = function(grade: EGrade, type?: EQuestionType) {
    const matchStage: any = { grade, isActive: true };
    if (type) {
        matchStage.type = type;
    }

    return this.aggregate([
        { $match: matchStage },
        { $sample: { size: 1 } }
    ]);
};

export const Question = mongoose.model<TQuestion>('Question', QuestionSchema);