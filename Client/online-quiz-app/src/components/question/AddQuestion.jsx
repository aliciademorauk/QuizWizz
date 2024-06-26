import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createQuestion, getSubjects } from '../../../utils/QuizService';

const AddQuestion = () => {
    const [question, setQuestion] = useState('');
    const [questionType, setQuestionType] = useState('single');
    const [choices, setChoices] = useState(['']);
    const [correctAnswers, setCorrectAnswers] = useState(['']);
    const [subject, setSubject] = useState('');
    const [newSubject, setNewSubject] = useState('');
    const [options, setOptions] = useState(['']);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const subjectsData = await getSubjects();
            setOptions(subjectsData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddChoice = async () => {
        const lastChoice = choices[choices.length - 1];
        if (lastChoice.trim() !== '') {
            const newChoice = '';
            setChoices([...choices, newChoice]);
        }
    };

    const handleRemoveChoice = (index) => {
        const newChoices = choices.filter((choice, i) => i !== index);
        if (newChoices.length === 0) {
            setChoices(['']);
        } else {
            setChoices(newChoices);
        }
    };

    const handleChangeChoice = (index, value) => {
        setChoices(choices.map((choice, i) => (i === index ? value : choice)));
    };

    const handleAddCorrectAnswer = () => {
        setCorrectAnswers([...correctAnswers, '']);
    };

    const handleChangeCorrectAnswer = (index, value) => {
        setCorrectAnswers(correctAnswers.map((answer, i) => (i === index ? value : answer)));
    };

    const handleRemoveCorrectAnswer = (index) => {
        setCorrectAnswers(correctAnswers.filter((answer, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = {
                question,
                questionType,
                choices,
                correctAnswers,
                subject,
            };
            await createQuestion(result);
            setQuestion('');
            setQuestionType('single');
            setSubject('');
            setChoices(['']);
            setCorrectAnswers(['']);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddSubject = () => {
        if (newSubject.trim() !=='') {
            setSubject(newSubject.trim());
            setOptions([...options, newSubject.trim()]);
            setNewSubject('');
        }
    };

    return (
        <div className='container'>
            <div className='row justify-content-center'>
                <div className='col-md-6 mt-5'>
                    <div className='card'>
                        <div className='card-header'>
                            <h5 className='card-title'>Add New Question</h5>
                        </div>
                        <div className='card-body'>
                            <form onSubmit={handleSubmit} className='p-2'>
                                <div className='mb-3'>
                                    <label htmlFor='subject' className='form-label text-info'>
                                        Select Subject
                                    </label>
                                    <select
                                        id='subject'
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className='form-control'>
                                        <option value=''>Select Subject</option>
                                        <option value='New'>Add New Subject</option>
                                        {options.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {subject === 'New' && (
                                    <div className='mb-3'>
                                        <label htmlFor='new-subject' className='form-label text-info'>
                                            Add New Subject
                                        </label>
                                        <input
                                            id='new-subject'
                                            type='text'
                                            value= {newSubject}
                                            onChange={(e) => setNewSubject(e.target.value)}
                                            className='form-control'
                                        />
                                        <button
                                            type='button'
                                            className='btn btn-outline-primary btn-sm mt-2'
                                            onClick={handleAddSubject}>
                                            Add Subject
                                        </button>
                                    </div>
                                )}
                                <div className='mb-2'>
                                    <label htmlFor='question' className='form-label text-info'>
                                        Question
                                    </label>
                                    <textarea
                                        className='form-control'
                                        rows={4}
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}>
                                    </textarea>
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='question-type' className='form-label text-info'>
                                        Question Type
                                    </label>
                                    <select
                                        className='form-control'
                                        id='question-type'
                                        value={questionType}
                                        onChange={(e) => setQuestionType(e.target.value)}>
                                        <option value={'single'}>Single Answer</option>
                                        <option value={'multiple'}>Multiple</option>
                                    </select>
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='choices' className='form-label text-info'>
                                        Choices
                                    </label>
                                    {choices.map((choice, index) => (
                                        <div key={index} className='input-group mb-3'>
                                            <input
                                                className='form-control'
                                                type='text'
                                                value={choice}
                                                onChange={(e) => handleChangeChoice(index, e.target.value)}/>
                                            <button
                                                className='btn btn-outline-danger btn-sm'
                                                type='button'
                                                onClick={() => handleRemoveChoice(index)}>
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        className='btn btn-outline-primary btn-sm'
                                        type='button'
                                        onClick={handleAddChoice}>
                                        Add Choice
                                    </button>
                                </div>
                                {questionType === 'single' && (
                                    <div className='mb-3'>
                                        <label className='form-label text-info' htmlFor='answer'>
                                            Correct Answer
                                        </label>
                                        <input
                                            className='form-control'
                                            type='text'
                                            value={correctAnswers[0]}
                                            onChange={(e) => handleChangeCorrectAnswer(0, e.target.value)}/>
                                    </div>
                                )}
                                {questionType === 'multiple' && (
                                    <div className='mb-3'>
                                        <label className='form-label text-info' htmlFor='answer'>
                                            Correct Answer
                                        </label>
                                        {correctAnswers.map((answer, index) => (
                                            <div key={index} className='d-flex mb-2'>
                                                <input
                                                    className='form-control'
                                                    type='text'
                                                    value={answer}
                                                    onChange={(e) => handleChangeCorrectAnswer(index, e.target.value)}/>
                                                {index > 0 && (
                                                    <button
                                                    className='btn btn-danger btn-small'
                                                    type='button'
                                                    onClick={() => handleRemoveCorrectAnswer(index)}>
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                        className='btn btn-outline-info'
                                        type='button'
                                        onClick={handleAddCorrectAnswer}>
                                            Add Correct Answer
                                        </button>
                                    </div>
                                )}
                                <div className='btn-group'>
                                    <button
                                    className='btn btn-outline-success mr-2'
                                    type='submit'>
                                        Save
                                    </button>
                                    <Link to={'/all-questions'} className='btn btn-outline-primary ml-2'>
										Back To All Questions
									</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddQuestion;
