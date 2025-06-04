import './progressNumbers.modules.css';
import { QuizAnswer } from '@typings/quiz';
import ProgressCircle from './progressCircle';

interface ProgressNumbersProps {
    currentQuestion: number;
    totalQuestions: number;
    userAnswers: QuizAnswer[];
    handleNumberClick: (questionIndex: number) => void;
}

const ProgressNumbers: React.FC<ProgressNumbersProps> = ({
    currentQuestion,
    totalQuestions,
    userAnswers,
    handleNumberClick,
}) => {
    const isAnswered = (questionIndex: number) => {
        const checkUserAnswers = userAnswers.some((answer) => answer.questionNumber === questionIndex + 1);
        return checkUserAnswers;
    };

    const isAnswerCorrect = (questionIndex: number) => {
        const answer = userAnswers.find((answer) => answer.questionNumber === questionIndex + 1);
        return answer?.isCorrect ?? false;
    };

    return (
        <div className='progressBar'>
            {Array.from({ length: totalQuestions }, (_, i) => (
                <ProgressCircle
                    key={i}
                    questionIndex={i}
                    currentQuestion={currentQuestion}
                    isAnswered={isAnswered(i)}
                    isCorrect={isAnswerCorrect(i)}
                    onClick={() => handleNumberClick(i)}
                />
            ))}
        </div>
    );
};

export default ProgressNumbers;
