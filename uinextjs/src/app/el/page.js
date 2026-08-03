'use client';

import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './page.module.css';
export default function Home() {

  const [question, setQuestion] = useState('');
  const [questionType, setQuestionType] = useState('Descriptive');
  const [answerText, setAnswerText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [status, setStatus] = useState('Active');
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);

useEffect(() => {
  const fetchQuestions = async () => {
    try {
      // Make sure the endpoint matches your route file
      const res = await fetch('/api/qnsdt');  
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const resdata=data.data;
      setQuestions(Array.isArray(resdata) ? resdata : []);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      setQuestions([]);
    }
  };

  fetchQuestions();
}, []); 

  // Save (Create or Update)
  const handleSave = async () => {
    const payload = {
      question,
      questionType,
      answerText: questionType === 'Descriptive' ? answerText : '',
      optionA: questionType === 'Multiple Choice' ? optionA : '',
      optionB: questionType === 'Multiple Choice' ? optionB : '',
      optionC: questionType === 'Multiple Choice' ? optionC : '',
      optionD: questionType === 'Multiple Choice' ? optionD : '',
      correctAnswer: questionType === 'Multiple Choice' ? correctAnswer : '',
      description,
      youtubeUrl,
      status,
    };

    const url = editingId ? `/api/qnsdt/${editingId}` : '/api/qnsdt';
    console.log(url)
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      resetForm();
      fetchQuestions();
    } catch (error) {
      alert('Error saving question: ' + error.message);
    }
  };

  // Reset form
  const resetForm = () => {
    setQuestion('');
    setQuestionType('Descriptive');
    setAnswerText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectAnswer('');
    setDescription('');
    setYoutubeUrl('');
    setStatus('Active');
    setEditingId(null);
  };

  // Edit
  const handleEdit = (q) => {
    setQuestion(q.question);
    setQuestionType(q.questionType);
    setAnswerText(q.answerText || '');
    setOptionA(q.optionA || '');
    setOptionB(q.optionB || '');
    setOptionC(q.optionC || '');
    setOptionD(q.optionD || '');
    setCorrectAnswer(q.correctAnswer || '');
    setDescription(q.description || '');
    setYoutubeUrl(q.youtubeUrl || '');
    setStatus(q.status || 'Active');
    setEditingId(q.id);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchQuestions();
    } catch (error) {
      alert('Error deleting: ' + error.message);
    }
  };

  // YouTube thumbnail helper
  const getYoutubeThumbnail = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/0.jpg`;
    }
    return null;
  };

  const thumbnail = getYoutubeThumbnail(youtubeUrl);

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Large Beautiful Card */}
          <div className={`card shadow-lg ${styles.card}`}>
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">
                {editingId ? 'Edit' : 'Add'} Question
              </h2>

              {/* Question */}
              <div className="mb-3">
                <label className="form-label">Question</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>

              {/* Question Type */}
              <div className="mb-3">
                <label className="form-label">Question Type</label>
                <select
                  className="form-select"
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                >
                  <option value="Descriptive">Descriptive</option>
                  <option value="Multiple Choice">Multiple Choice</option>
                </select>
              </div>

              {/* Conditional Fields */}
              {questionType === 'Descriptive' && (
                <div className="mb-3">
                  <label className="form-label">Answer</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                  />
                </div>
              )}

              {questionType === 'Multiple Choice' && (
                <>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Option A</label>
                      <input
                        type="text"
                        className="form-control"
                        value={optionA}
                        onChange={(e) => setOptionA(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Option B</label>
                      <input
                        type="text"
                        className="form-control"
                        value={optionB}
                        onChange={(e) => setOptionB(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Option C</label>
                      <input
                        type="text"
                        className="form-control"
                        value={optionC}
                        onChange={(e) => setOptionC(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Option D</label>
                      <input
                        type="text"
                        className="form-control"
                        value={optionD}
                        onChange={(e) => setOptionD(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Correct Answer</label>
                    <select
                      className="form-select"
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                    >
                      <option value="">Select correct answer</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                </>
              )}

              {/* Additional Fields */}
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">YouTube URL</label>
                <input
                  type="text"
                  className="form-control"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
              </div>

              {thumbnail && (
                <div className="mb-3 text-center">
                  <label className="form-label">YouTube Thumbnail Preview</label>
                  <div>
                    <img
                      src={thumbnail}
                      alt="YouTube Thumbnail"
                      className="img-fluid"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Buttons with Gradients */}
              <div className="d-flex gap-2 justify-content-end mt-4">
                <button
                  className={`btn ${styles.gradientBtn}`}
                  onClick={handleSave}
                >
                  {editingId ? 'Update' : 'Save'} Question
                </button>
                <button
                  className={`btn ${styles.gradientBtnReset}`}
                  onClick={resetForm}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Questions List - with safe check */}
          <div className="mt-5">
            <h3>Questions List</h3>
            {!Array.isArray(questions) || questions.length === 0 ? (
              <p>No questions yet.</p>
            ) : (
              <div className="row">
                {questions.map((q) => (
                  <div key={q.id} className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">{q.question}</h5>
                        <p className="card-text">
                          <strong>Type:</strong> {q.questionType}
                        </p>
                        {q.questionType === 'Descriptive' && (
                          <p><strong>Answer:</strong> {q.answerText}</p>
                        )}
                        {q.questionType === 'Multiple Choice' && (
                          <>
                            <p>
                              <strong>Options:</strong> A: {q.optionA}, B: {q.optionB},
                              C: {q.optionC}, D: {q.optionD}
                            </p>
                            <p><strong>Correct:</strong> {q.correctAnswer}</p>
                          </>
                        )}
                        <p><strong>Status:</strong> {q.status}</p>
                        {q.youtubeUrl && (
                          <div className="mb-2">
                            <img
                              src={getYoutubeThumbnail(q.youtubeUrl)}
                              alt="thumb"
                              style={{ maxWidth: '100%', height: 'auto' }}
                            />
                          </div>
                        )}
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEdit(q)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(q.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}