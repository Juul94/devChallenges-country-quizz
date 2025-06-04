import './progressNumbers.modules.css';
import CheckIcon from '@icons/Check_round_fill.svg';
import CloseIcon from '@icons/Close_round_fill.svg';

interface ProgressCircleProps {
    questionIndex: number;
    isAnswered: boolean;
    isCorrect: boolean;
    onClick?: () => void;
    currentQuestion?: number;
    showNumbers?: boolean;
    smallNumber?: boolean;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
    questionIndex,
    isAnswered,
    isCorrect,
    onClick,
    currentQuestion,
    showNumbers,
    smallNumber,
}) => {
    const isActive = currentQuestion === questionIndex;

    const className = `progressCircle ${isActive ? 'active' : isAnswered ? 'answered' : ''} ${smallNumber ? 'smallNumber' : ''}`;

    return (
        <div className={className} onClick={onClick}>
            {isAnswered && !showNumbers ? (
                isCorrect ? (
                    <img src={CheckIcon} alt='Correct answer' />
                ) : (
                    <img src={CloseIcon} alt='Wrong answer' />
                )
            ) : (
                questionIndex + 1
            )}
        </div>
    );
};

export default ProgressCircle;
