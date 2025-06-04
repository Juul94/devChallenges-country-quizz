import './header.modules.css';
import TrophyIcon from '@images/trophy.png';

interface HeaderProps {
    totalCorrectAnswers: number;
    totalQuestions: number;
}

const Header: React.FC<HeaderProps> = ({ totalCorrectAnswers, totalQuestions }) => (
    <div className='flexContainer'>
        <h1>Country Quiz</h1>

        <div className='highlightGradient pointCounter'>
            <img src={TrophyIcon} className='trophyImage' alt='Trophy' />
            <h5>{`${totalCorrectAnswers} / ${totalQuestions} Points`}</h5>
        </div>
    </div>
);

export default Header;
