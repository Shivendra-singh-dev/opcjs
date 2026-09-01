'use client';

import { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './page.module.css';
import Navbar from '@/components/navbar';

const normalizeQuestion = (q = {}) => {
  const questionType = String(
    q.question_type ?? q.questionType ?? ''
  ).toLowerCase();

  return {
    id: q.id,
    question: q.question || '',
    questionType,
    optionA: q.option_a ?? q.optionA ?? '',
    optionB: q.option_b ?? q.optionB ?? '',
    optionC: q.option_c ?? q.optionC ?? '',
    optionD: q.option_d ?? q.optionD ?? '',
    correctAnswer: String(q.correct_answer ?? q.correctAnswer ?? '').toUpperCase(),
    answerText: q.descriptive_answer ?? q.answerText ?? '',
    description: q.description || '',
    youtubeUrl: q.youtube_url ?? q.youtubeUrl ?? '',
    thumbnailUrl: q.thumbnail_url ?? q.thumbnailUrl ?? '',
    status: (() => {
      const raw = String(q.status || 'active').toLowerCase();
      return raw === 'inactive' ? 'Inactive' : 'Active';
    })(),
  };
};

const isObjectiveQuestion = (q) => {
  if (!q) return false;
  const type = String(q.questionType || '').toLowerCase();
  if (type === 'objective' || type.includes('choice') || type === 'mcq') {
    return true;
  }
  // Fallback: treat as MCQ when options exist in DB
  return Boolean(q.optionA || q.optionB || q.optionC || q.optionD);
};

export default function Home() {
  // ---------- Form state ----------
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
  const [editingId, setEditingId] = useState(null);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  // ---------- Data & UI state ----------
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('learn');
  const [manageView, setManageView] = useState('list'); // list | form
  const [manageSearch, setManageSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Learn mode state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerStatus, setAnswerStatus] = useState('idle');
  const [countdown, setCountdown] = useState(null);
  const [loadingNext, setLoadingNext] = useState(false);

  const countdownIntervalRef = useRef(null);
  const autoAdvanceTimerRef = useRef(null);

  // ---------- Helper functions ----------
  const getBackendType = (uiType) =>
    uiType === 'Multiple Choice' ? 'objective' : 'descriptive';

  const getUiType = (backendType) =>
    String(backendType || '').toLowerCase() === 'objective'
      ? 'Multiple Choice'
      : 'Descriptive';

  const getYoutubeThumbnail = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/0.jpg`;
    }
    return null;
  };

  // ---------- API calls ----------
  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/el?limit=1000&page=1&sort=DESC');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const fetched = Array.isArray(data.data)
        ? data.data.map(normalizeQuestion)
        : [];
      setQuestions(fetched);
      setCurrentIndex((prev) =>
        fetched.length === 0 ? 0 : Math.min(prev, fetched.length - 1)
      );
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      setQuestions([]);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const validateForm = () => {
    if (!question.trim()) return 'Question is required';
    if (questionType === 'Multiple Choice') {
      if (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
        return 'All four options are required for Multiple Choice';
      }
      if (!correctAnswer) return 'Please select the correct answer';
    }
    if (questionType === 'Descriptive' && !answerText.trim()) {
      return 'Answer is required for Descriptive questions';
    }
    return '';
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      setSaveMessage({ type: 'error', text: validationError });
      return;
    }

    const isMcq = questionType === 'Multiple Choice';
    const payload = {
      question: question.trim(),
      question_type: getBackendType(questionType),
      option_a: isMcq ? optionA.trim() : '',
      option_b: isMcq ? optionB.trim() : '',
      option_c: isMcq ? optionC.trim() : '',
      option_d: isMcq ? optionD.trim() : '',
      correct_answer: isMcq ? correctAnswer.toLowerCase() : '',
      descriptive_answer: !isMcq ? answerText.trim() : '',
      description: description.trim(),
      youtube_url: youtubeUrl.trim(),
      thumbnail_url: getYoutubeThumbnail(youtubeUrl) || '',
      status: status.toLowerCase() === 'inactive' ? 'inactive' : 'active',
    };

    const url = editingId ? `/api/el/${editingId}` : '/api/el';
    const method = editingId ? 'PUT' : 'POST';

    setSaving(true);
    setSaveMessage({ type: '', text: '' });

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detail =
          Array.isArray(data.errors) && data.errors.length
            ? data.errors.join(', ')
            : data.message || 'Save failed';
        throw new Error(detail);
      }
      resetForm(true);
      setManageView('list');
      await fetchQuestions();
    } catch (error) {
      setSaveMessage({ type: 'error', text: error.message || 'Error saving question' });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = (clearMessage = true) => {
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
    if (clearMessage) setSaveMessage({ type: '', text: '' });
  };

  const openAddForm = () => {
    resetForm(true);
    setManageView('form');
    setActiveTab('manage');
  };

  const closeForm = () => {
    resetForm(true);
    setManageView('list');
  };

  const handleEdit = (q) => {
    setQuestion(q.question);
    setQuestionType(getUiType(q.questionType));
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
    setSaveMessage({ type: '', text: '' });
    setActiveTab('manage');
    setManageView('form');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      const res = await fetch(`/api/el/${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      await fetchQuestions();
    } catch (error) {
      alert('Error deleting: ' + error.message);
    }
  };

  // ---------- Learn mode logic ----------
  const activeQuestions = questions.filter((q) => q.status === 'Active');
  const learnQuestions = activeQuestions.length ? activeQuestions : questions;
  const currentQuestion = learnQuestions[currentIndex] || null;
  const totalQuestions = learnQuestions.length;

  const filteredManageQuestions = questions.filter((q) => {
    const query = manageSearch.trim().toLowerCase();
    const matchesSearch =
      !query ||
      q.question.toLowerCase().includes(query) ||
      (q.description || '').toLowerCase().includes(query);
    const matchesType =
      typeFilter === 'all' ||
      (typeFilter === 'objective' && isObjectiveQuestion(q)) ||
      (typeFilter === 'descriptive' && !isObjectiveQuestion(q));
    return matchesSearch && matchesType;
  });

  const objectiveCount = questions.filter((q) => isObjectiveQuestion(q)).length;
  const descriptiveCount = questions.length - objectiveCount;
  const activeCount = questions.filter((q) => q.status === 'Active').length;

  const clearLearnTimers = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  const resetLearnState = () => {
    clearLearnTimers();
    setSelectedOption('');
    setShowAnswer(false);
    setAnswerStatus('idle');
    setCountdown(null);
    setLoadingNext(false);
  };

  const goToNextWithLoading = () => {
    if (currentIndex >= totalQuestions - 1) {
      resetLearnState();
      return;
    }
    setLoadingNext(true);
    autoAdvanceTimerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      resetLearnState();
      setLoadingNext(false);
    }, 600);
  };

  const goToNext = () => {
    if (loadingNext || currentIndex >= totalQuestions - 1) return;
    resetLearnState();
    setCurrentIndex((prev) => prev + 1);
  };

  const goToPrev = () => {
    if (currentIndex === 0 || loadingNext) return;
    resetLearnState();
    setCurrentIndex((prev) => prev - 1);
  };

  const startCountdown = () => {
    let counter = 5;
    setCountdown(counter);
    countdownIntervalRef.current = setInterval(() => {
      counter -= 1;
      setCountdown(counter);
      if (counter === 0) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
        goToNextWithLoading();
      }
    }, 1000);
  };

  const handleOptionClick = (option) => {
    if (answerStatus === 'correct' || loadingNext || !currentQuestion) return;

    const isCorrect = option === currentQuestion.correctAnswer;

    if (isCorrect) {
      setSelectedOption(option);
      setAnswerStatus('correct');
      startCountdown();
    } else {
      setSelectedOption(option);
      setAnswerStatus('wrong');
    }
  };

  const handleShowAnswer = () => {
    if (showAnswer || loadingNext) return;
    setShowAnswer(true);
    setAnswerStatus('correct');
    startCountdown();
  };

  useEffect(() => {
    return () => clearLearnTimers();
  }, []);

  useEffect(() => {
    if (activeTab !== 'learn') {
      clearLearnTimers();
    }
  }, [activeTab]);

  useEffect(() => {
    if (currentIndex >= totalQuestions && totalQuestions > 0) {
      setCurrentIndex(0);
      resetLearnState();
    }
  }, [totalQuestions, currentIndex]);

  // ---------- Render ----------
  return (
    <>
      <Navbar />
      <div className="container py-4">
        {/* Tabs */}
        <ul className="nav nav-tabs nav-fill mb-4">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === 'learn' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('learn');
                resetLearnState();
              }}
            >
              Learn
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === 'manage' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('manage');
                if (!editingId) setManageView('list');
              }}
            >
              Manage
            </button>
          </li>
        </ul>

        {/* LEARN TAB */}
        {activeTab === 'learn' && (
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {totalQuestions === 0 ? (
                <div className="alert alert-info text-center">
                  No questions available. Go to <strong>Manage</strong> to add some.
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted">
                      {currentIndex + 1} / {totalQuestions}
                    </span>
                    <div className="progress flex-grow-1 mx-3" style={{ height: '8px' }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-muted">
                      {Math.round(((currentIndex + 1) / totalQuestions) * 100)}%
                    </span>
                  </div>

                  <div className={`card shadow-lg border-0 ${styles.learnCard}`}>
                    <div className="card-body p-4">
                      {loadingNext || !currentQuestion ? (
                        <div className="text-center py-5">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading next question...</span>
                          </div>
                          <p className="mt-2 text-muted">Loading next question…</p>
                        </div>
                      ) : (
                        <>
                          <div className="mb-2">
                            <span className="badge bg-secondary">
                              {getUiType(currentQuestion.questionType)}
                            </span>
                          </div>

                          <h5 className="card-title fw-bold mb-3">
                            {currentQuestion.question}
                          </h5>

                          {currentQuestion.description ? (
                            <div className="mb-3 text-muted small">
                              <strong>Description:</strong> {currentQuestion.description}
                            </div>
                          ) : null}

                          {(currentQuestion.thumbnailUrl ||
                            getYoutubeThumbnail(currentQuestion.youtubeUrl)) && (
                            <div className="mb-3">
                              <img
                                src={
                                  currentQuestion.thumbnailUrl ||
                                  getYoutubeThumbnail(currentQuestion.youtubeUrl)
                                }
                                alt="Thumbnail"
                                className="img-fluid rounded"
                                style={{ maxHeight: '120px' }}
                              />
                            </div>
                          )}

                          {isObjectiveQuestion(currentQuestion) ? (
                            <div className="mt-3">
                              {['A', 'B', 'C', 'D'].map((opt) => {
                                const value =
                                  currentQuestion[`option${opt}`] || '';
                                const isSelected = selectedOption === opt;
                                const isCorrectAnswer =
                                  opt === currentQuestion.correctAnswer;

                                let className =
                                  'btn w-100 text-start mb-2 d-flex align-items-center';
                                if (answerStatus === 'correct') {
                                  className += isCorrectAnswer
                                    ? ' btn-success'
                                    : ' btn-outline-secondary';
                                } else if (answerStatus === 'wrong') {
                                  if (isSelected && !isCorrectAnswer) {
                                    className += ' btn-danger';
                                  } else if (isCorrectAnswer) {
                                    className += ' btn-outline-success';
                                  } else {
                                    className += ' btn-outline-primary';
                                  }
                                } else {
                                  className += isSelected
                                    ? ' btn-primary'
                                    : ' btn-outline-primary';
                                }

                                const disabled =
                                  answerStatus === 'correct' || loadingNext;

                                return (
                                  <button
                                    type="button"
                                    key={opt}
                                    className={className}
                                    onClick={() => handleOptionClick(opt)}
                                    disabled={disabled || !value}
                                  >
                                    <span className="fw-bold me-2">{opt}.</span>{' '}
                                    {value || <em className="text-muted">Empty</em>}
                                    {answerStatus === 'correct' && isCorrectAnswer && (
                                      <span className="ms-auto">Correct</span>
                                    )}
                                    {answerStatus === 'wrong' &&
                                      isSelected &&
                                      !isCorrectAnswer && (
                                        <span className="ms-auto">Wrong</span>
                                      )}
                                    {answerStatus === 'wrong' && isCorrectAnswer && (
                                      <span className="ms-auto">Correct</span>
                                    )}
                                  </button>
                                );
                              })}

                              {answerStatus === 'wrong' && (
                                <div className="mt-3 text-center text-danger small">
                                  Incorrect. Please try again.
                                </div>
                              )}
                              {answerStatus === 'correct' && (
                                <div className="mt-3 text-center text-success small">
                                  Correct! Next question in {countdown}…
                                </div>
                              )}
                              {countdown !== null &&
                                countdown > 0 &&
                                answerStatus === 'correct' && (
                                  <div className="mt-2 text-center fw-bold text-primary">
                                    {countdown}
                                  </div>
                                )}
                            </div>
                          ) : (
                            <div className="mt-3">
                              {!showAnswer ? (
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={handleShowAnswer}
                                  disabled={answerStatus === 'correct' || loadingNext}
                                >
                                  Read Answer
                                </button>
                              ) : (
                                <div className="alert alert-success">
                                  <strong>Answer:</strong>{' '}
                                  {currentQuestion.answerText || 'No answer provided.'}
                                </div>
                              )}
                              {showAnswer && answerStatus === 'correct' && (
                                <>
                                  <div className="mt-3 text-center text-success small">
                                    Answer shown. Next question in {countdown}…
                                  </div>
                                  {countdown !== null && countdown > 0 && (
                                    <div className="mt-2 text-center fw-bold text-primary">
                                      {countdown}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={goToPrev}
                      disabled={currentIndex === 0 || loadingNext}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={goToNext}
                      disabled={currentIndex === totalQuestions - 1 || loadingNext}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* MANAGE TAB */}
        {activeTab === 'manage' && (
          <div className={styles.manageWrap}>
            {manageView === 'list' ? (
              <>
                <div className={styles.manageHeader}>
                  <div>
                    <p className={styles.manageEyebrow}>Question bank</p>
                    <h2 className={styles.manageTitle}>Manage Questions</h2>
                    <p className={styles.manageSubtitle}>
                      Browse, edit, and organize your learning content.
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={openAddForm}
                  >
                    <span className={styles.addBtnIcon}>+</span>
                    Add Question
                  </button>
                </div>

                <div className={styles.statsRow}>
                  <div className={styles.statChip}>
                    <span className={styles.statValue}>{questions.length}</span>
                    <span className={styles.statLabel}>Total</span>
                  </div>
                  <div className={styles.statChip}>
                    <span className={styles.statValue}>{activeCount}</span>
                    <span className={styles.statLabel}>Active</span>
                  </div>
                  <div className={styles.statChip}>
                    <span className={styles.statValue}>{objectiveCount}</span>
                    <span className={styles.statLabel}>MCQ</span>
                  </div>
                  <div className={styles.statChip}>
                    <span className={styles.statValue}>{descriptiveCount}</span>
                    <span className={styles.statLabel}>Descriptive</span>
                  </div>
                </div>

                <div className={styles.toolbar}>
                  <div className={styles.searchBox}>
                    <span className={styles.searchIcon} aria-hidden="true">
                      ⌕
                    </span>
                    <input
                      type="search"
                      className={styles.searchInput}
                      placeholder="Search questions or descriptions..."
                      value={manageSearch}
                      onChange={(e) => setManageSearch(e.target.value)}
                    />
                  </div>
                  <div className={styles.filterGroup}>
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'objective', label: 'MCQ' },
                      { id: 'descriptive', label: 'Descriptive' },
                    ].map((f) => (
                      <button
                        type="button"
                        key={f.id}
                        className={`${styles.filterBtn} ${
                          typeFilter === f.id ? styles.filterBtnActive : ''
                        }`}
                        onClick={() => setTypeFilter(f.id)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredManageQuestions.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>?</div>
                    <h3>
                      {questions.length === 0
                        ? 'No questions yet'
                        : 'No matching questions'}
                    </h3>
                    <p>
                      {questions.length === 0
                        ? 'Create your first question to start building the learn bank.'
                        : 'Try a different search or filter.'}
                    </p>
                    {questions.length === 0 && (
                      <button
                        type="button"
                        className={styles.addBtn}
                        onClick={openAddForm}
                      >
                        <span className={styles.addBtnIcon}>+</span>
                        Add Question
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={styles.questionList}>
                    {filteredManageQuestions.map((q, idx) => (
                      <article key={q.id} className={styles.questionItem}>
                        <div className={styles.questionIndex}>{idx + 1}</div>
                        <div className={styles.questionBody}>
                          <div className={styles.questionMeta}>
                            <span
                              className={`${styles.typeBadge} ${
                                isObjectiveQuestion(q)
                                  ? styles.typeMcq
                                  : styles.typeDesc
                              }`}
                            >
                              {getUiType(q.questionType)}
                            </span>
                            <span
                              className={`${styles.statusDot} ${
                                q.status === 'Active'
                                  ? styles.statusActive
                                  : styles.statusInactive
                              }`}
                            >
                              {q.status}
                            </span>
                          </div>
                          <h3 className={styles.questionText}>{q.question}</h3>
                          {q.description ? (
                            <p className={styles.questionDesc}>{q.description}</p>
                          ) : null}
                          {isObjectiveQuestion(q) ? (
                            <div className={styles.optionPreview}>
                              {['A', 'B', 'C', 'D'].map((opt) => {
                                const value = q[`option${opt}`];
                                if (!value) return null;
                                const isCorrect = q.correctAnswer === opt;
                                return (
                                  <span
                                    key={opt}
                                    className={`${styles.optionChip} ${
                                      isCorrect ? styles.optionChipCorrect : ''
                                    }`}
                                  >
                                    <strong>{opt}</strong> {value}
                                  </span>
                                );
                              })}
                            </div>
                          ) : q.answerText ? (
                            <p className={styles.answerPreview}>
                              <strong>Answer:</strong> {q.answerText}
                            </p>
                          ) : null}
                        </div>
                        <div className={styles.questionActions}>
                          <button
                            type="button"
                            className={styles.iconBtn}
                            onClick={() => handleEdit(q)}
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                            onClick={() => handleDelete(q.id)}
                            title="Delete"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className={`card border-0 ${styles.cardForm}`}>
                <div className="card-body p-4 p-md-5">
                  <div className={styles.formHeader}>
                    <button
                      type="button"
                      className={styles.backBtn}
                      onClick={closeForm}
                    >
                      ← Back to list
                    </button>
                    <h3 className={styles.formTitle}>
                      {editingId ? 'Edit Question' : 'Add New Question'}
                    </h3>
                    <p className={styles.formHint}>
                      {editingId
                        ? 'Update the question details and save your changes.'
                        : 'Fill in the details below to add a question to the bank.'}
                    </p>
                  </div>

                  {saveMessage.text ? (
                    <div
                      className={`alert ${
                        saveMessage.type === 'error'
                          ? 'alert-danger'
                          : 'alert-success'
                      }`}
                    >
                      {saveMessage.text}
                    </div>
                  ) : null}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Question</label>
                    <textarea
                      className={`form-control ${styles.modernInput}`}
                      rows="3"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Type your question here..."
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Question Type</label>
                    <div className={styles.typeToggle}>
                      {['Descriptive', 'Multiple Choice'].map((type) => (
                        <button
                          type="button"
                          key={type}
                          className={`${styles.typeToggleBtn} ${
                            questionType === type ? styles.typeToggleActive : ''
                          }`}
                          onClick={() => setQuestionType(type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {questionType === 'Descriptive' && (
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Answer</label>
                      <textarea
                        className={`form-control ${styles.modernInput}`}
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
                        {['A', 'B', 'C', 'D'].map((opt) => (
                          <div className="col-md-6 mb-3" key={opt}>
                            <label className="form-label fw-semibold">
                              Option {opt}
                            </label>
                            <input
                              type="text"
                              className={`form-control ${styles.modernInput}`}
                              value={
                                opt === 'A'
                                  ? optionA
                                  : opt === 'B'
                                    ? optionB
                                    : opt === 'C'
                                      ? optionC
                                      : optionD
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                if (opt === 'A') setOptionA(val);
                                else if (opt === 'B') setOptionB(val);
                                else if (opt === 'C') setOptionC(val);
                                else setOptionD(val);
                              }}
                              placeholder={`Option ${opt}`}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Correct Answer
                        </label>
                        <div className={styles.correctGroup}>
                          {['A', 'B', 'C', 'D'].map((opt) => (
                            <button
                              type="button"
                              key={opt}
                              className={`${styles.correctBtn} ${
                                correctAnswer === opt ? styles.correctBtnActive : ''
                              }`}
                              onClick={() => setCorrectAnswer(opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      className={`form-control ${styles.modernInput}`}
                      rows="2"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Additional description (optional)"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">YouTube URL</label>
                    <input
                      type="text"
                      className={`form-control ${styles.modernInput}`}
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://youtube.com/..."
                    />
                  </div>

                  {getYoutubeThumbnail(youtubeUrl) && (
                    <div className="mb-3 text-center">
                      <img
                        src={getYoutubeThumbnail(youtubeUrl)}
                        alt="Thumbnail"
                        className={`img-fluid rounded ${styles.thumbPreview}`}
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Status</label>
                    <div className={styles.typeToggle}>
                      {['Active', 'Inactive'].map((s) => (
                        <button
                          type="button"
                          key={s}
                          className={`${styles.typeToggleBtn} ${
                            status === s ? styles.typeToggleActive : ''
                          }`}
                          onClick={() => setStatus(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <button
                      type="button"
                      className={styles.secondaryBtn}
                      onClick={closeForm}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={styles.addBtn}
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving
                        ? 'Saving...'
                        : editingId
                          ? 'Update Question'
                          : 'Save Question'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
