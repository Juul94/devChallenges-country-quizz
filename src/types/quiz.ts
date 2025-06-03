export interface CountryQuestionAPI {
    response_code: number;
    results: QuizQuestion[];
}

export interface QuizQuestion {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export interface QuizAnswer {
    questionNumber: number;
    selectedOption: string;
    correctOption: string;
    isCorrect: boolean;
}

export interface ShuffledQuizQuestion extends QuizQuestion {
    shuffledOptions: string[];
}
