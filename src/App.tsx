import { Fragment } from 'react';
import './App.css';
import './styles/global.css';
import QuizBoard from './components/quizBoard/quizBoard';

function App() {
    return (
        <Fragment>
            <QuizBoard heading='Country Quiz' />
        </Fragment>
    );
}

export default App;
