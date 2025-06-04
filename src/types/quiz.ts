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
    questionText: string;
}

export interface ShuffledQuizQuestion extends QuizQuestion {
    shuffledOptions: string[];
}

export interface QuestionViewModel {
    questionText: string;
    questionNumber: number;
    options: {
        text: string;
        isSelected: boolean;
        isCorrect: boolean;
        isIncorrect: boolean;
    }[];
    isAnswered: boolean;
}
