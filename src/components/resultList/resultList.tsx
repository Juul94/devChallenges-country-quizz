import './resultList.modules.css';
import ProgressCircle from '@components/progressNumbers/progressCircle';
import { QuizAnswer } from '@typings/quiz';
import CheckIcon from '@icons/Check_round_fill.svg';
import CloseIcon from '@icons/Close_round_fill.svg';
import { FaLongArrowAltDown } from 'react-icons/fa';
import { Fragment } from 'react/jsx-runtime';

interface ResultListProps {
    userAnswers: QuizAnswer[];
}

const ResultList: React.FC<ResultListProps> = ({ userAnswers }) => (
    <div>
        <h4 className='allAnswersHeading'>Your answers:</h4>

        <div className='answerlist'>
            {userAnswers.map((answer, index) => (
                <div key={`${answer.questionNumber}-${index}`}>
                    <div className='answerItem'>
                        <div className='questionNumber'>
                            <ProgressCircle
                                questionIndex={answer.questionNumber - 1}
                                isAnswered={true}
                                isCorrect={answer.isCorrect}
                                showNumbers
                                smallNumber
                            />
                        </div>

                        <div className='questionDetails'>
                            <span className='qusetionResultText'>{answer.questionText}</span>

                            <div className='questionResult'>
                                {answer.isCorrect ? (
                                    <img src={CheckIcon} className='resultIcon' alt='Correct answer' />
                                ) : (
                                    <img src={CloseIcon} className='resultIcon' alt='Correct answer' />
                                )}

                                <div className='questionResultText'>
                                    <span className={`userAnswer ${answer.isCorrect ? 'rightAnswer' : 'wrongAnswer'}`}>
                                        {answer.selectedOption}
                                    </span>

                                    {!answer.isCorrect && (
                                        <Fragment>
                                            <FaLongArrowAltDown className='arrowDownIcon' />
                                            <span className='userAnswer rightAnswer'>{answer.correctOption}</span>
                                        </Fragment>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='divider' />
                </div>
            ))}
        </div>
    </div>
);

export default ResultList;
