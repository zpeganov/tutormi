// API Service for communicating with the backend

const API_BASE_URL = '/api';

// Helper to get auth token from localStorage
const getToken = () => localStorage.getItem('tutormi_token');

// Helper to make authenticated requests
const authFetch = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  
  return data;
};

// Auth API
export const authAPI = {
  // Register tutor
  registerTutor: async (userData) => {
    const data = await authFetch('/auth/register/tutor', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      localStorage.setItem('tutormi_token', data.token);
      localStorage.setItem('tutormi_user', JSON.stringify(data.user));
    }
    return data;
  },
  
  // Register student
  registerStudent: async (userData) => {
    return authFetch('/auth/register/student', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  // Login tutor
  loginTutor: async (credentials) => {
    const data = await authFetch('/auth/login/tutor', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      localStorage.setItem('tutormi_token', data.token);
      localStorage.setItem('tutormi_user', JSON.stringify(data.user));
    }
    return data;
  },
  
  // Login student
  loginStudent: async (credentials) => {
    const data = await authFetch('/auth/login/student', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      localStorage.setItem('tutormi_token', data.token);
      localStorage.setItem('tutormi_user', JSON.stringify(data.user));
    }
    return data;
  },
  
  // Get current user
  getCurrentUser: async () => {
    return authFetch('/auth/me');
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('tutormi_token');
    localStorage.removeItem('tutormi_user');
  },
  
  // Check if logged in
  isLoggedIn: () => {
    return !!getToken();
  },
};

// Lesson API
export const getLessons = async (params) => {
  const query = new URLSearchParams(params).toString();
  return authFetch(`/lessons?${query}`);
};

export const createLesson = async (lessonData) => {
  return authFetch('/lessons', {
    method: 'POST',
    body: JSON.stringify(lessonData),
  });
};

// Announcement API
export const getAnnouncements = async (params) => {
  const query = new URLSearchParams(params).toString();
  return authFetch(`/announcements?${query}`);
};

export const createAnnouncement = async (announcementData) => {
  return authFetch('/announcements', {
    method: 'POST',
    body: JSON.stringify(announcementData),
  });
};

// Student API
export const getMyStudents = async () => {
  return authFetch('/tutors/my-students');
};

export const getStudentRequests = async () => {
  return authFetch('/tutors/requests');
};

export const handleStudentRequest = async (requestId, status) => {
  return authFetch(`/tutors/requests/${requestId}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};

// Course API
export const getCourses = async () => {
  return authFetch('/courses');
};

export const createCourse = async (courseData) => {
  return authFetch('/courses', {
    method: 'POST',
    body: JSON.stringify(courseData),
  });
};

export const updateCourse = async (courseId, courseData) => {
  return authFetch(`/courses/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(courseData),
  });
};

export const deleteCourse = async (courseId) => {
  return authFetch(`/courses/${courseId}`, {
    method: 'DELETE',
  });
};
