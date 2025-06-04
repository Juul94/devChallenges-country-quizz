import { QuizAnswer } from '@typings/quiz';
import './congratulations.modules.css';
import CongratsImage from '@images/congrats.png';
import ResultList from '@components/resultList/resultList';

interface CongratulationsProps {
    totalCorrectAnswers: number;
    totalQuestions: number;
    handleResetQuiz: () => void;
    userAnswers: QuizAnswer[];
}

const Congratulations: React.FC<CongratulationsProps> = ({
    totalCorrectAnswers,
    totalQuestions,
    handleResetQuiz,
    userAnswers,
}) => (
    <div className='container'>
        <div className='resultBoard'>
            <img src={CongratsImage} className='congrasImage' alt='Congratulations image' />
            <h4 className='congrasHeading'>Congrats! You completed the quiz.</h4>
            <p className='congratsLabel'>{`You answer ${totalCorrectAnswers}/${totalQuestions} correctly`}</p>

            <button onClick={() => handleResetQuiz()} className='btnResetGame'>
                Play again
            </button>

            <ResultList userAnswers={userAnswers} />
        </div>
    </div>
);

export default Congratulations;
