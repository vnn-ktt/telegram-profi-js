import {Random} from "random-js";

// export default class Randomizer {
//
// }

import questions from '../database/junior/questions.json';
export const getRandomQuestion = (topic : string) => {
    const topicLowerCase = topic.toLowerCase();
    const random = new Random();
    const randomQuestionIndex = random.integer(
        0,
        // @ts-ignore
    questions[topicLowerCase].length
    );
    // @ts-ignore
    return questions[topicLowerCase][randomQuestionIndex];
}

