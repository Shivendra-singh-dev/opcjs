const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

export const getQuestions = async (params = {}) => {
  const searchParams = new URLSearchParams(params).toString();
  return request(`/questions${searchParams ? `?${searchParams}` : ''}`);
};

export const getQuestionById = async (id) => request(`/questions/${id}`);
export const createQuestion = async (payload) => request('/questions', { method: 'POST', body: JSON.stringify(payload) });
export const updateQuestion = async (id, payload) => request(`/questions/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteQuestion = async (id) => request(`/questions/${id}`, { method: 'DELETE' });
