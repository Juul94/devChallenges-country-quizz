import './quizBoard.modules.css';
import { useEffect, useState, type FC } from 'react';
import { CountryQuestionAPI, QuizAnswer, ShuffledQuizQuestion } from '@typings/quiz';
import Congratulations from '@components/congratulations/congratulations';
import Question from '@components/question/question';
import ProgressNumbers from '@components/progressNumbers/progressNumbers';
import Header from '@components/header/header';

interface QuizBoardProps {
    heading: string;
}

const QuizBoard: FC<QuizBoardProps> = () => {
    /*
     *   HOOKS & LOCAL VARIABLES
     */

    const [questions, setQuestions] = useState<ShuffledQuizQuestion[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [userAnswers, setUserAnswers] = useState<QuizAnswer[]>([]);

    const [showResult, setShowResult] = useState(false);
    const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);

    const totalQuestions: number = 10;
    const apiUrl = 'https://opentdb.com/api.php?amount=10&category=22&type=multiple&difficulty=easy';

    const totalCorrectAnswers = userAnswers.filter((answer) => answer.isCorrect).length;
    const isAllQuestionsAnswered = userAnswers.length === totalQuestions;

    const showNextQuestionButton = currentQuestion + 1 < totalQuestions && !isAllQuestionsAnswered;
    const showPrevQuestionButton = currentQuestion > 0 && !isAllQuestionsAnswered;
    const isAtFirstQuestion = currentQuestion === 0;

    const currentQ = questions[currentQuestion];

    const transformedOptions = currentQ?.shuffledOptions.map((option) => {
        const answer = userAnswers.find(({ questionNumber }) => questionNumber === currentQuestion + 1);

        const questionState = {
            text: option,
            isSelected: answer?.selectedOption === option,
            isCorrect: answer?.correctOption === option,
            isIncorrect: answer?.selectedOption === option && answer?.selectedOption !== answer?.correctOption,
        };

        return questionState;
    });

    const questionViewModel = {
        questionText: currentQ?.question,
        questionNumber: currentQuestion + 1,
        options: transformedOptions ?? [],
        isAnswered: !!userAnswers.find(({ questionNumber }) => questionNumber === currentQuestion + 1),
    };

    /*
     *   FUNCTIONS
     */

    const shuffleOptions = (array: string[]): string[] => {
        const shuffledArray = [...array].sort(() => Math.random() - 0.5);
        return shuffledArray;
    };

    const fetchQuestions = async () => {
        const hasAlreadyFetched = questions.length > 0 || isLoadingApi;
        if (hasAlreadyFetched) return;

        try {
            setIsLoadingApi(true);
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data: CountryQuestionAPI = await response.json();

            const processedQuestions: ShuffledQuizQuestion[] = data.results.map((question) => {
                const allOptions = [...question.incorrect_answers, question.correct_answer];
                const shuffledOptions = shuffleOptions(allOptions);
                return {
                    ...question,
                    shuffledOptions,
                };
            });

            setQuestions(processedQuestions);
            setIsLoadingApi(false);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    };

    /*
     *   EFFECTS
     */

    useEffect(() => {
        fetchQuestions();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showResult]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight' && showNextQuestionButton) {
                handleNextQuestion();
            } else if (event.key === 'ArrowLeft' && showPrevQuestionButton) {
                handlePrevQuestion();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showNextQuestionButton, showPrevQuestionButton]);

    /*
     *   HANDLERS
     */

    const handleSelectAnswer = (questionIndex: number, selectedOption: string) => {
        const question = questions[questionIndex];
        if (!question) return;

        const questionNumber = questionIndex + 1;
        const isAnswerCorrect = question.correct_answer === selectedOption;

        const alreadyAnswered = userAnswers.some((ans) => ans.questionNumber === questionNumber);
        if (alreadyAnswered) return;

        const newAnswer: QuizAnswer = {
            correctOption: question.correct_answer,
            questionNumber,
            selectedOption,
            isCorrect: isAnswerCorrect,
            questionText: question.question,
        };

        setUserAnswers((prev) => [...prev, newAnswer]);
    };

    const handleNextQuestion = () => {
        if (isAllQuestionsAnswered) {
            setShowResult(true);
        } else {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    const handlePrevQuestion = () => {
        setCurrentQuestion((prev) => prev - 1);
        setShowResult(false);
    };

    const handleResetQuiz = () => {
        setCurrentQuestion(0);
        setUserAnswers([]);
        setShowResult(false);
        setIsLoadingApi(false);
        setQuestions([]);
    };

    const handleNumberClick = (number: number) => {
        if (isAllQuestionsAnswered) return null;

        setCurrentQuestion(number);
        setShowResult(false);
    };

    if (showResult) {
        return (
            <Congratulations
                totalCorrectAnswers={totalCorrectAnswers}
                totalQuestions={totalQuestions}
                handleResetQuiz={handleResetQuiz}
                userAnswers={userAnswers}
            />
        );
    }

    return (
        <div className='container'>
            <Header totalCorrectAnswers={totalCorrectAnswers} totalQuestions={totalQuestions} />

            <div className='quizBoard'>
                <ProgressNumbers
                    currentQuestion={currentQuestion}
                    totalQuestions={totalQuestions}
                    userAnswers={userAnswers}
                    handleNumberClick={handleNumberClick}
                />

                {isLoadingApi ? (
                    <p>Loading questions...</p>
                ) : (
                    questions
                        .filter((_, index) => currentQuestion === index)
                        .map((_, index) => (
                            <Question
                                key={index}
                                viewModel={questionViewModel}
                                onSelectOption={(option) => handleSelectAnswer(currentQuestion, option)}
                                onNext={handleNextQuestion}
                                onPrev={handlePrevQuestion}
                                showNext={showNextQuestionButton}
                                showPrev={showPrevQuestionButton}
                                isAllAnswered={isAllQuestionsAnswered}
                                isFirst={isAtFirstQuestion}
                            />
                        ))
                )}
            </div>
        </div>
    );
};

export default QuizBoard;
