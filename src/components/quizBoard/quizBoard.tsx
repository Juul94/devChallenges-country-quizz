import './quizBoard.modules.css';
import { Fragment, useState, type FC } from 'react';
import Trophy from '@images/trophy.png';

interface QuizBoardProps {
    heading: string;
}

const QuizBoard: FC<QuizBoardProps> = () => {
    const [points, setPoints] = useState<number>(0);

    const totalQuestions: number = 10;

    /*
        To do:

        1. Add API point with country quiz data

        2. Map through the questions
            - Display the question number (If it has been answered or not to show different styles)
            - Question text
            - Options for the question (When selected, it should show the correct answer and disable the options)

        3. Remember to increase the points if the user selects the correct answer
        
        4. When passed through all 10 questions, display the congratulations message with the points scored and image
    */

    return (
        <Fragment>
            <div className='container'>
                <div className='flexContainer'>
                    <h1>Country Quiz</h1>

                    <div className='highlightGradient pointCounter'>
                        <img src={Trophy} className='trophyImage' alt='Trophy' />

                        <h5>
                            {points} / {totalQuestions}
                        </h5>
                    </div>
                </div>

                <div className='quizBoard'>Board here</div>
            </div>
        </Fragment>
    );
};

export default QuizBoard;
