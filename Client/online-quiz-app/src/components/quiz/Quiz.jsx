import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchQuizToDisplay } from '../../../utils/QuizService';
import AnswerOptions from '../../../utils/AnswerOptions';

const Quiz = () => {
    const [quizQuestions, setQuizQuestions] = useState([
        {
            id: '',
            correctAnswers: '',
            question: '',
            questionType: ''
        }
    ]);

    const [selectedAnswers, setSelectedAnswers] = useState([
        {
            id: '',
            answer: ''
        }
    ]);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [totalScore, setTotalScore] = useState(0)
    const location = useLocation();
    console.log(location)
    const navigate = useNavigate();
    const { selectedSubject, selectedNumOfQs } = location.state;
    console.log(selectedSubject, selectedNumOfQs)

    useEffect(() => {
        fetchQuizData();
    }, []);

    const fetchQuizData = async () => {
        if (selectedNumOfQs && selectedSubject) {
            const questions = await fetchQuizToDisplay(selectedNumOfQs, selectedSubject);
            setQuizQuestions(questions);
        }
    };

    const handleChangeAnswer = (questionId, answer) => {
        setSelectedAnswers((previousAns) => {
            const existingAnsIndex = previousAns.findIndex((answerObj) => answerObj.id === questionId);

            if (existingAnsIndex !== -1) {
                const updatedAnswers = [...previousAns];
                updatedAnswers[existingAnsIndex] = { id: questionId, answer: answer };
                return updatedAnswers;
            } else {
                const newAnswer = { id: questionId, answer: answer };
                return [...previousAns, newAnswer];
            }
        });
    };

    const isChecked = (questionId, choice) => {
        const selectedAnswer = selectedAnswers.find((answer) => answer.id === questionId);
        console.log(selectedAnswer, choice)
        if (!selectedAnswer) {
            return false;
        }
        return selectedAnswer.answer === choice;
    };

    const handleChangeCheckbox = (questionId, choice) => {
        setSelectedAnswers((previousAns) => {
            const existingAnsIndex = previousAns.findIndex((answerObj) => answerObj.id === questionId);

            if (existingAnsIndex !== -1) {
                const updatedAnswers = [...previousAns];
                const existingAnswer = updatedAnswers[existingAnsIndex].answer;
                let newAnswer;
                if (Array.isArray(existingAnswer)) {
                    newAnswer = existingAnswer.includes(choice) ? existingAnswer.filter((a) => a !== choice) : [...existingAnswer, choice];
                } else {
                    newAnswer = [existingAnswer, choice];
                }
                updatedAnswers[existingAnsIndex] = { id: questionId, answer: newAnswer };
                return updatedAnswers;
            } else {
                const newAnswer = { id: questionId, answer: [choice] };
                return [...previousAns, newAnswer];
            }
        });
    };

    const handleSubmit = () => {
        let score = 0;
        quizQuestions.forEach((question) => {
            const selectedAnswer = selectedAnswers.find((answer) => answer.id === question.id);
            if (selectedAnswer) {
                const selectedOptions = selectedAnswer.answer;
                const correctOptions = question.correctAnswers;
                console.log(selectedOptions, correctOptions);
                let isCorrect = false;
                if (Array.isArray(selectedOptions)) {
                    isCorrect = selectedOptions.length === correctOptions.length && selectedOptions.every((option) => correctOptions.includes(option));
                } else {
                    isCorrect = selectedOptions === correctOptions[0];
                }
                console.log(isCorrect)
                if (isCorrect) {
                    score++;
                }
            }
        });
        setTotalScore(score);
        setSelectedAnswers([]);
        setCurrentQuestionIndex(0);
        navigate('/quiz-result', { state: { quizQuestions, totalScore: score } });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((previousIndex) => previousIndex - 1);
        }
    };

    return (
        <div className='p-5'>
            <h3 className='text-info'>
                Question {quizQuestions.length > 0 ? currentQuestionIndex + 1 : 0} of {quizQuestions.length}
            </h3>
            <hr />
            <h4 className='mb-4'>
                {quizQuestions[currentQuestionIndex]?.question}
            </h4>
            <AnswerOptions
                question={quizQuestions[currentQuestionIndex]}
                isChecked={isChecked}
                handleChangeAnswer={handleChangeAnswer}
                handleChangeCheckbox={handleChangeCheckbox}
            />
            <div className='mt-4'>
                <button
                    className='btn btn-primary btn-sm me-2'
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}>
                    Previous Question
                </button>
                <button
                    className={`btn btn-sm btn-info ${currentQuestionIndex === quizQuestions.length - 1 && 'btn btn-sm btn-warning'}`}
                    disabled={
                        !selectedAnswers.find(
                            (answer) =>
                                answer.id === quizQuestions[currentQuestionIndex]?.id || answer.answer.length > 0
                        )
                    }
                    onClick={handleNextQuestion}>
                    {currentQuestionIndex === quizQuestions.length - 1 ? 'Submit Quiz' : 'Next Question'}
                </button>
            </div>
        </div>
    );
};

export default Quiz;