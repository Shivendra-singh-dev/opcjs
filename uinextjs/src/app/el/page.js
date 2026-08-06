'use client';

import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './page.module.css';
import Navbar from '@/components/navbar';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [questionType, setQuestionType] = useState('Descriptive'); // UI label
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

  // ----- helper: convert UI label to backend value -----
  const getBackendType = (uiType) => {
    return uiType === 'Multiple Choice' ? 'objective' : 'descriptive';
  };

  // ----- helper: convert backend value to UI label -----
  const getUiType = (backendType) => {
    return backendType === 'objective' ? 'Multiple Choice' : 'Descriptive';
  };

  // ----- fetch questions -----
  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/qnsdt');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setQuestions(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      setQuestions([]);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // ----- save (create or update) -----
  const handleSave = async () => {

    const payload = {
      question,
      question_type: getBackendType(questionType),

      option_a: questionType === "Multiple Choice" ? optionA : "",
      option_b: questionType === "Multiple Choice" ? optionB : "",
      option_c: questionType === "Multiple Choice" ? optionC : "",
      option_d: questionType === "Multiple Choice" ? optionD : "",

      correct_answer:
        questionType === "Multiple Choice" ? correctAnswer.toLowerCase() : "",

      descriptive_answer:
        questionType === "Descriptive" ? answerText : "",

      description,

      youtube_url: youtubeUrl,

      thumbnail_url: getYoutubeThumbnail(youtubeUrl) || "",

      status,
    };

    const url = editingId ? `/api/qnsdt/${editingId}` : '/api/qnsdt';
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
      console.log('Error saving question: ' + error.message);
    }
  };

  // ----- reset form -----
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

  // ----- edit (populate form) -----
  const handleEdit = (q) => {
    setQuestion(q.question);
    setQuestionType(getUiType(q.questionType)); // convert backend to UI label
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

  // ----- delete (fixed endpoint) -----
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      const res = await fetch(`/api/qnsdt/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchQuestions();
    } catch (error) {
      alert('Error deleting: ' + error.message);
    }
  };

  // ----- YouTube thumbnail helper -----
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

  // ----- render -----
  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* ----- Form Card (modern) ----- */}
            <div className={`card shadow-lg border-0 ${styles.cardForm}`}>
              <div className="card-body p-4 p-md-5">
                <h2 className="card-title text-center mb-4 fw-light">
                  {editingId ? '✏️ Edit' : '➕ Add'} Question
                </h2>

                {/* Question */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Question</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Type your question here..."
                  />
                </div>

                {/* Question Type */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Question Type</label>
                  <select
                    className="form-select"
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                  >
                    <option value="Descriptive">Descriptive</option>
                    <option value="Multiple Choice">Multiple Choice</option>
                  </select>
                </div>

                {/* Conditional fields */}
                {questionType === 'Descriptive' && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Answer</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Write the answer..."
                    />
                  </div>
                )}

                {questionType === 'Multiple Choice' && (
                  <>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Option A</label>
                        <input
                          type="text"
                          className="form-control"
                          value={optionA}
                          onChange={(e) => setOptionA(e.target.value)}
                          placeholder="Option A"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Option B</label>
                        <input
                          type="text"
                          className="form-control"
                          value={optionB}
                          onChange={(e) => setOptionB(e.target.value)}
                          placeholder="Option B"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Option C</label>
                        <input
                          type="text"
                          className="form-control"
                          value={optionC}
                          onChange={(e) => setOptionC(e.target.value)}
                          placeholder="Option C"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Option D</label>
                        <input
                          type="text"
                          className="form-control"
                          value={optionD}
                          onChange={(e) => setOptionD(e.target.value)}
                          placeholder="Option D"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Correct Answer</label>
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

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Additional description (optional)"
                  />
                </div>

                {/* YouTube URL */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">YouTube URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>

                {thumbnail && (
                  <div className="mb-3 text-center">
                    <label className="form-label fw-semibold">Thumbnail Preview</label>
                    <div>
                      <img
                        src={thumbnail}
                        alt="YouTube Thumbnail"
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: '180px' }}
                      />
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Status</label>
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-2 justify-content-end mt-4">
                  <button
                    className={`btn ${styles.gradientBtn}`}
                    onClick={handleSave}
                  >
                    {editingId ? '🔄 Update' : '💾 Save'} Question
                  </button>
                  <button
                    className={`btn ${styles.gradientBtnReset}`}
                    onClick={resetForm}
                  >
                    🗑️ Reset
                  </button>
                </div>
              </div>
            </div>

            {/* ----- Questions List (modern cards) ----- */}
            <div className="mt-5">
              <h3 className="fw-light mb-4">📋 Questions List</h3>
              {!Array.isArray(questions) || questions.length === 0 ? (
                <p className="text-muted">No questions yet. Add your first question above!</p>
              ) : (
                <div className="row">
                  {questions.map((q) => (
                    <div key={q.id} className="col-md-6 col-lg-4 mb-4">
                      <div className={`card h-100 shadow-sm border-0 ${styles.listCard}`}>
                        <div className="card-body">
                          <h5 className="card-title fw-bold">{q.question}</h5>
                          <div className="mb-2">
                            <span className="badge bg-secondary me-1">
                              {getUiType(q.questionType)}  {/* display human‑readable */}
                            </span>
                            <span
                              className={`badge ${q.status === 'Active' ? 'bg-success' : 'bg-danger'
                                }`}
                            >
                              {q.status}
                            </span>
                          </div>

                          {q.questionType === 'descriptive' && q.answerText && (
                            <p className="card-text small">
                              <strong>Answer:</strong> {q.answerText}
                            </p>
                          )}

                          {q.questionType === 'objective' && (
                            <>
                              <p className="card-text small">
                                <strong>Options:</strong> A: {q.optionA}, B: {q.optionB},
                                C: {q.optionC}, D: {q.optionD}
                              </p>
                              <p className="card-text small">
                                <strong>Correct:</strong> {q.correctAnswer}
                              </p>
                            </>
                          )}

                          {q.description && (
                            <p className="card-text small text-muted">
                              {q.description}
                            </p>
                          )}

                          {q.youtubeUrl && (
                            <div className="mb-2">
                              <img
                                src={getYoutubeThumbnail(q.youtubeUrl)}
                                alt="Thumbnail"
                                className="img-fluid rounded"
                                style={{ maxHeight: '100px' }}
                              />
                            </div>
                          )}

                          <div className="d-flex gap-2 mt-3">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEdit(q)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(q.id)}
                            >
                              🗑️ Delete
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
    </>
  );
}