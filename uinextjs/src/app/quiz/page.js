'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createQuestion, deleteQuestion, getQuestions, updateQuestion } from '../lib/quizApi';

const initialForm = {
  question: '',
  question_type: 'objective',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_answer: '',
  descriptive_answer: '',
  description: '',
  youtube_url: '',
  status: 'active'
};

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [confirmId, setConfirmId] = useState(null);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const result = await getQuestions({ page, limit: 10, search, sort: 'DESC' });
      setQuestions(result.data || []);
      setPagination(result.pagination || pagination);
    } catch (error) {
      showMessage('error', error.message || 'Unable to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const showMessage = (type, text) => setMessage({ type, text });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.question.trim()) {
      showMessage('error', 'Question is required');
      return;
    }

    if (form.question_type === 'objective') {
      if (!form.option_a || !form.option_b || !form.option_c || !form.option_d || !form.correct_answer) {
        showMessage('error', 'Objective questions need all options and a correct answer');
        return;
      }
    }

    setLoading(true);
    try {
      if (editingId) {
        await updateQuestion(editingId, form);
        showMessage('success', 'Question updated successfully');
      } else {
        await createQuestion(form);
        showMessage('success', 'Question created successfully');
      }

      setForm(initialForm);
      setEditingId(null);
      await fetchQuestions();
      router.push('/quiz');
    } catch (error) {
      showMessage('error', error.message || 'Unable to save question');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (question) => {
    setEditingId(question.id);
    setForm({
      question: question.question || '',
      question_type: question.question_type || 'objective',
      option_a: question.option_a || '',
      option_b: question.option_b || '',
      option_c: question.option_c || '',
      option_d: question.option_d || '',
      correct_answer: question.correct_answer || '',
      descriptive_answer: question.descriptive_answer || '',
      description: question.description || '',
      youtube_url: question.youtube_url || '',
      status: question.status || 'active'
    });
  };

  const handleDelete = async () => {
    if (!confirmId) return;

    setLoading(true);
    try {
      await deleteQuestion(confirmId);
      showMessage('success', 'Question deleted successfully');
      setConfirmId(null);
      await fetchQuestions();
    } catch (error) {
      showMessage('error', error.message || 'Unable to delete question');
    } finally {
      setLoading(false);
    }
  };

  const thumbnailUrl = useMemo(() => {
    if (!form.youtube_url) return '';
    const match = form.youtube_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/i);
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : '';
  }, [form.youtube_url]);

  return (
    <main style={{ padding: 24, background: '#f5f7fb', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ margin: 0 }}>Quiz Management</h1>
            <p style={{ margin: '4px 0 0', color: '#5b6472' }}>Create, edit, and review quiz questions with previews and metadata.</p>
          </div>
        </div>

        {message.text ? (
          <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 8, background: message.type === 'success' ? '#e8f7ee' : '#fdecea', color: message.type === 'success' ? '#176b3f' : '#a33a2d' }}>
            {message.text}
          </div>
        ) : null}

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 20, alignItems: 'start' }}>
          <section style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 12px 30px rgba(0,0,0,0.06)' }}>
            <h2 style={{ marginTop: 0 }}>{editingId ? 'Edit Question' : 'Add Question'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
              <label>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Question</div>
                <textarea value={form.question} onChange={(event) => setForm({ ...form, question: event.target.value })} rows={3} style={inputStyle} />
              </label>

              <label>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Question Type</div>
                <select value={form.question_type} onChange={(event) => setForm({ ...form, question_type: event.target.value })} style={inputStyle}>
                  <option value="objective">Objective (Multiple Choice)</option>
                  <option value="descriptive">Descriptive</option>
                </select>
              </label>

              {form.question_type === 'objective' ? (
                <>
                  <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    {['option_a', 'option_b', 'option_c', 'option_d'].map((field) => (
                      <label key={field}>
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>{field.replace('_', ' ').toUpperCase()}</div>
                        <input value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} style={inputStyle} />
                      </label>
                    ))}
                  </div>
                  <label>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>Correct Answer</div>
                    <select value={form.correct_answer} onChange={(event) => setForm({ ...form, correct_answer: event.target.value })} style={inputStyle}>
                      <option value="">Select answer</option>
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </label>
                </>
              ) : (
                <label>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Answer</div>
                  <textarea value={form.descriptive_answer} onChange={(event) => setForm({ ...form, descriptive_answer: event.target.value })} rows={4} style={inputStyle} />
                </label>
              )}

              <label>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Description / Explanation</div>
                <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} style={inputStyle} />
              </label>

              <label>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>YouTube URL</div>
                <input value={form.youtube_url} onChange={(event) => setForm({ ...form, youtube_url: event.target.value })} style={inputStyle} />
              </label>

              {thumbnailUrl ? (
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Thumbnail Preview</div>
                  <img src={thumbnailUrl} alt="Question thumbnail" style={{ width: 240, borderRadius: 12 }} />
                </div>
              ) : null}

              <label>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Status</div>
                <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} style={inputStyle}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" disabled={loading} style={primaryButtonStyle}>{loading ? 'Saving...' : editingId ? 'Update Question' : 'Save Question'}</button>
                {editingId ? <button type="button" onClick={() => { setEditingId(null); setForm(initialForm); }} style={secondaryButtonStyle}>Cancel</button> : null}
              </div>
            </form>
          </section>

          <section style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 12px 30px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ margin: 0 }}>Questions</h2>
              <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search questions" style={{ ...inputStyle, width: 220 }} />
            </div>

            {loading ? <div style={{ textAlign: 'center', padding: 24 }}>Loading...</div> : null}

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Question</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question) => (
                    <tr key={question.id} style={{ borderBottom: '1px solid #eef2f7' }}>
                      <td style={tdStyle}>{question.id}</td>
                      <td style={tdStyle}>{question.question}</td>
                      <td style={tdStyle}>{question.question_type}</td>
                      <td style={tdStyle}>{question.status}</td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button type="button" onClick={() => router.push(`/quiz/${question.id}`)} style={secondaryButtonStyle}>View</button>
                          <button type="button" onClick={() => startEdit(question)} style={secondaryButtonStyle}>Edit</button>
                          <button type="button" onClick={() => setConfirmId(question.id)} style={{ ...secondaryButtonStyle, borderColor: '#ef4444', color: '#ef4444' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
              <div>Page {pagination.page} of {pagination.totalPages}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} style={secondaryButtonStyle}>Prev</button>
                <button type="button" disabled={page >= pagination.totalPages} onClick={() => setPage((value) => value + 1)} style={secondaryButtonStyle}>Next</button>
              </div>
            </div>
          </section>
        </div>

        {confirmId ? (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: 360 }}>
              <h3 style={{ marginTop: 0 }}>Delete question?</h3>
              <p>Are you sure you want to delete this question?</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" onClick={() => setConfirmId(null)} style={secondaryButtonStyle}>Cancel</button>
                <button type="button" onClick={handleDelete} style={{ ...primaryButtonStyle, background: '#ef4444', borderColor: '#ef4444' }}>Delete</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

const inputStyle = {
  width: '100%',
  border: '1px solid #d7deea',
  borderRadius: 10,
  padding: '10px 12px',
  fontSize: 14,
  boxSizing: 'border-box'
};

const thStyle = { padding: '10px 8px', fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' };
const tdStyle = { padding: '10px 8px', fontSize: 14, color: '#334155' };
const primaryButtonStyle = { background: '#2563eb', color: '#fff', border: '1px solid #2563eb', borderRadius: 10, padding: '10px 14px', cursor: 'pointer' };
const secondaryButtonStyle = { background: '#fff', color: '#334155', border: '1px solid #d7deea', borderRadius: 10, padding: '10px 14px', cursor: 'pointer' };
