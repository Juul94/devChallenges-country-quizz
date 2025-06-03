import './quizBoard.modules.css';
import { Fragment, useEffect, useState, type FC } from 'react';
import TrophyIcon from '@images/trophy.png';
import CheckIcon from '@icons/Check_round_fill.svg';
import CloseIcon from '@icons/Close_round_fill.svg';
import CongratsImage from '@images/congrats.png';
import { CountryQuestionAPI, QuizAnswer, ShuffledQuizQuestion } from '@typings/quiz';
import { MdNavigateNext } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';

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

    const showNextQuestionButton = currentQuestion + 1 < totalQuestions;
    const showPrevQuestionButton = currentQuestion > 0;
    const isAtFirstQuestion = currentQuestion === 0;

    const totalCorrectAnswers = userAnswers.filter((answer) => answer.isCorrect).length;
    const isAllQuestionsAnswered = userAnswers.length === totalQuestions;

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
    }, [showResult]);

    /*
     *   HANDLERS
     */

    const handleSelectAnswer = (questionIndex: number, selectedOption: string) => {
        const question = questions[questionIndex];
        if (!question) return;

        const questionNumber = questionIndex + 1;
        const isAnswerCorrect = question.correct_answer === selectedOption;

        // Prevent answering again
        const alreadyAnswered = userAnswers.some((ans) => ans.questionNumber === questionNumber);
        if (alreadyAnswered) return;

        const newAnswer: QuizAnswer = {
            correctOption: question.correct_answer,
            questionNumber,
            selectedOption,
            isCorrect: isAnswerCorrect,
        };

        setUserAnswers((prev) => [...prev, newAnswer]);
    };

    const handleNextQuestion = () => {
        if (isAllQuestionsAnswered) {
            // To do: Calculate the quiz result and show the result page with the total score and congratulations message
            setShowResult(true);
        } else {
            setCurrentQuestion((prevIndex) => prevIndex + 1);

            const isLastQuestion = currentQuestion + 1 === totalQuestions;

            if (isLastQuestion) {
                setShowResult(true);
            }
        }
    };

    const handlePrevQuestion = () => {
        const previousQuestion = currentQuestion - 1;
        const isFirstQuestion = previousQuestion < 0;

        if (isFirstQuestion) return;

        setCurrentQuestion(previousQuestion);
        setShowResult(false);
    };

    const handleResetQuiz = () => {
        setCurrentQuestion(0);
        setUserAnswers([]);
        setShowResult(false);
        setIsLoadingApi(false);
        setQuestions([]);
    };

    // const handleFinishQuiz = () => {
    //     // Calculate the quiz result and show the result page
    // };

    const isAnswered = (questionIndex: number) => {
        const checkUserAnswers = userAnswers.some((answer) => answer.questionNumber === questionIndex + 1);
        return checkUserAnswers;
    };

    const isAnswerCorrect = (questionIndex: number) => {
        const answer = userAnswers.find((answer) => answer.questionNumber === questionIndex + 1);
        return answer?.isCorrect ?? false;
    };

    const isOptionSelected = (questionIndex: number, option: string) => {
        const answer = userAnswers.find(({ questionNumber }) => questionNumber === questionIndex + 1);
        return answer ? answer.selectedOption === option : false;
    };

    const isAnyOptionSelected = (questionIndex: number) => {
        const answer = userAnswers.find(({ questionNumber }) => questionNumber === questionIndex + 1);
        return answer ? answer.selectedOption !== '' : false;
    };

    const isOptionCorrect = (questionIndex: number, option: string) => {
        const answer = userAnswers.find(({ questionNumber }) => questionNumber === questionIndex + 1);
        return answer ? answer.correctOption === option : false;
    };

    const isOptionIncorrect = (questionIndex: number, option: string) => {
        const answer = userAnswers.find(({ questionNumber }) => questionNumber === questionIndex + 1);
        return answer ? answer.selectedOption !== answer.correctOption && answer.selectedOption === option : false;
    };

    // Randomly shuffle the options for each question
    const shuffleOptions = (array: string[]): string[] => {
        const shuffledArray = [...array].sort(() => Math.random() - 0.5);
        return shuffledArray;
    };

    // Available for keyboard navigation to navigate through questions
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

    if (showResult) {
        return (
            <div className='container'>
                <div className='resultBoard'>
                    <img src={CongratsImage} className='congrasImage' alt='Congratulations image' />
                    <h4 className='congrasHeading'>Congrats! You completed the quiz.</h4>
                    <p className='congratsLabel'>{`You answer ${totalCorrectAnswers}/${totalQuestions} correctly`}</p>

                    <button onClick={() => handleResetQuiz()} className='btnResetGame'>
                        Play again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Fragment>
            <div className='container'>
                <div className='flexContainer'>
                    <h1>Country Quiz</h1>

                    <div className='highlightGradient pointCounter'>
                        <img src={TrophyIcon} className='trophyImage' alt='Trophy' />

                        <h5>
                            {totalCorrectAnswers} / {totalQuestions}
                        </h5>
                    </div>
                </div>

                <div className='quizBoard'>
                    <div className='progressBar'>
                        {Array.from({ length: totalQuestions }, (_, i) => (
                            <div
                                key={i}
                                className={`progressCircle ${
                                    i < currentQuestion || isAnswered(i) ? 'answered' : i === currentQuestion ? 'active' : ''
                                }`}>
                                {isAnswered(i) ? (
                                    isAnswerCorrect(i) ? (
                                        <img src={CheckIcon} className='checkIconNumber' alt='Correct answer' />
                                    ) : (
                                        <img src={CloseIcon} className='closeIconNumber' alt='Wrong answer' />
                                    )
                                ) : (
                                    i + 1
                                )}
                            </div>
                        ))}
                    </div>

                    {isLoadingApi ? (
                        <p>Loading questions...</p>
                    ) : (
                        questions
                            .filter((_, index) => currentQuestion === index)
                            .map((question, index) => (
                                <div key={index} className='questionCard'>
                                    <h4 className='questionText'>{question.question}</h4>

                                    <div className='optionsList'>
                                        {question.shuffledOptions?.map((option, optionIndex) => (
                                            <button
                                                key={optionIndex}
                                                onClick={() => handleSelectAnswer(currentQuestion, option)}
                                                className={`btnOption ${isOptionSelected(currentQuestion, option) ? 'correctAnswer noHoverSelected' : isAnyOptionSelected(currentQuestion) ? 'noHoverDefault' : ''}`}
                                                disabled={isAnyOptionSelected(currentQuestion)}>
                                                {option}

                                                {isOptionCorrect(currentQuestion, option) && (
                                                    <img src={CheckIcon} alt='Correct answer' />
                                                )}

                                                {isOptionIncorrect(currentQuestion, option) && (
                                                    <img src={CloseIcon} alt='Wrong answer' />
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    <div
                                        className={`navigationButtons ${isAtFirstQuestion || isAllQuestionsAnswered ? 'flex-end' : ''}`}>
                                        {showPrevQuestionButton && !isAllQuestionsAnswered && (
                                            <button onClick={handlePrevQuestion} className='prevButton'>
                                                <GrFormPrevious />
                                            </button>
                                        )}

                                        {(showNextQuestionButton || isAllQuestionsAnswered) && (
                                            <button onClick={handleNextQuestion} className='nextButton'>
                                                <MdNavigateNext />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </div>
        </Fragment>
    );
};

export default QuizBoard;
