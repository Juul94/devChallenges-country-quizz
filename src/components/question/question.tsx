import './question.modules.css';
import { QuestionViewModel } from '@typings/quiz';
import { MdNavigateNext } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';
import CheckIcon from '@icons/Check_round_fill.svg';
import CloseIcon from '@icons/Close_round_fill.svg';

interface QuestionProps {
    key: number;
    viewModel: QuestionViewModel;
    onSelectOption: (option: string) => void;
    onNext: () => void;
    onPrev: () => void;
    showNext: boolean;
    showPrev: boolean;
    isAllAnswered: boolean;
    isFirst: boolean;
}

const Question: React.FC<QuestionProps> = ({
    viewModel,
    onSelectOption,
    onNext,
    onPrev,
    showNext,
    showPrev,
    isAllAnswered,
    isFirst,
}) => {
    const { questionText, options, isAnswered, questionNumber } = viewModel;

    return (
        <div className='questionCard'>
            <h4 className='questionText'>{`${questionNumber}: ${questionText}`}</h4>

            <div className='optionsList'>
                {options.map(({ text, isSelected, isCorrect, isIncorrect }, index) => (
                    <button
                        key={index}
                        onClick={() => onSelectOption(text)}
                        className={`btnOption ${
                            isSelected ? 'correctAnswer noHoverSelected' : isAnswered ? 'noHoverDefault' : ''
                        }`}
                        disabled={isAnswered}>
                        {text}
                        {isCorrect && <img src={CheckIcon} alt='Correct answer' />}
                        {isIncorrect && <img src={CloseIcon} alt='Wrong answer' />}
                    </button>
                ))}
            </div>

            <div className={`navigationButtons ${isFirst || isAllAnswered ? 'flex-end' : ''}`}>
                {showPrev && (
                    <button onClick={onPrev} className='btnPrevButton'>
                        <GrFormPrevious />
                    </button>
                )}

                {(showNext || isAllAnswered) && (
                    <button onClick={onNext} className={`btnNextButton ${isAllAnswered && 'highlightGradient'}`}>
                        {isAllAnswered ? 'Show results' : <MdNavigateNext />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Question;
