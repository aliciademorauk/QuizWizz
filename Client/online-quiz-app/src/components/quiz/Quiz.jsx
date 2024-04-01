import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { fetchQuizToDisplay } from '../../../utils/QuizService'

const Quiz = () => {
    const[quizQuestions, setQuizQuestions] = useState([{
        id: '', correctAnswers: '', question: '', questionType: ''
    }])

    const[selectedAnswers, setSelectedAnswers] = useState([{
        id: '', answer: ['']
    }])

    const[currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const[totalScore, setTotalScore] = useState(0)
    const location = useLocation()
    const navigate = useNavigate()
    const[selectedSubject, selectedNumOfQuestions] = location.state


    useEffect(() => {
        fetchQuizData()
    }, [])

    const fetchQuizData = async() => {
        if (selectedNumOfQuestions && selectedSubject) {
            const questions = await fetchQuizToDisplay(selectedNumOfQuestions, selectedSubject)
            setQuizQuestions(questions)
        }
    }

    const handleChangeAnswer = (questionId, answer) => {
        setSelectedAnswers((previousAns) => {
            const existingAnsIndex = previousAns.findIndex((answerObj) => answerObj.id === questionId)
            const selectedAnswer = Array.isArray(answer) ? answer.map((a) => a.charAt(0)) : answer.charAt(0)

            if (existingAnsIndex !== -1) {
                const updatedAnswers = [...previousAns]
                updatedAnswers[existingAnsIndex] = {id: questionId, answer: selectedAnswer}
                return updatedAnswers
            } else {
                const newAnswer = {id: questionId, answer: selectedAnswer}
                return [...previousAns, newAnswer]
            }
        })
    }

    const isChecked = (questionId, choice) => {
        const selectedAnswer = selectedAnswers.find((answer) => answer.id === questionId)
        if (!selectedAnswer) {
            return false
        }
        if (Array.isArray(selectedAnswer.answer)) {
            return selectedAnswer.answer.includes(choice.charAt(0))
        }
        return selectedAnswer.answer === choice.charAt(0)
    }

    const handleChangeCheckbox = (questionId, choice) => {
        setSelectedAnswers((previousAns) => {
            const existingAnsIndex = previousAns.findIndex((answerObj) => answerObj.id === questionId)
            const selectedAnswer = Array.isArray(choice) ? choice.map((c) => c.charAt(0)) : choice.charAt(0)

            if (existingAnsIndex !== -1) {
                const updatedAnswers  = [...previousAns]
                const existingAnswers = updatedAnswers[existingAnsIndex].answer
                let newAnswer
                if (Array.isArray(existingAnswers)) {
                    newAnswer = existingAnswers.includes(selectedAnswer) 
                    ? existingAnswers.filter((a) => a !== selectedAnswer)
                    : [...existingAnswers, selectedAnswer]
                } else {
                    newAnswer = [existingAnswers, selectedAnswer]
                }
                updatedAnswers[existingAnsIndex] = {id: questionId, answer: newAnswer}
                return updatedAnswers
            } else {
                const newAnswer = {id: questionId, answer: [selectedAnswer]} 
                return [...previousAns, newAnswer]
            }
        })
    }

    const handleSubmit = () => {
        let score = 0
        quizQuestions.forEach((question) => {
            const selectedAnswer = selectedAnswers.find((answer) => answer.id === question.id)
            if (selectedAnswer) {
                const selectedOptions = Array.isArray(selectedAnswer.answer) 
                ? selectedAnswer.answer
                : [selectedAnswer.answer]
                const correctOptions = Array.isArray(question.correctAnswers)
                ? question.correctAnswers
                : [question.correctAnswers]
                const isCorrect = selectedOptions.every((option) => 
                correctOptions.includes(option))
                if(isCorrect) {
                    score++
                }
            }
        })

        setTotalScore(score)
        setSelectedAnswers([{id: '', answer: ['']}])
        setCurrentQuestionIndex(0)
        navigate('/quiz-result', {state: {quizQuestions, totalScore: score}})
    }

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex((previousIndex) => previousIndex + 1)
        } else {
            handleSubmit()
        }
    }

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((previousIndex) => previousIndex - 1)
        }
    }

  return (
    <div>

    </div>
  )
}

export default Quiz