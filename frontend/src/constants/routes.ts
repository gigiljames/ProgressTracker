export const ROUTES = {
  AUTH: {
    SEND_OTP: "/auth/send-otp",
    VERIFY_OTP: "/auth/verify-otp",
    SIGNUP: "/auth/signup",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh",
    ME: "/auth/me",
  },

  DASHBOARD: {
    GET_SLOTS: "/slots",
    CREATE_SLOT: "/slots",
    EDIT_SLOT: (slotId: string) => `/slots/${slotId}`,
    DELETE_SLOT: (slotId: string) => `/slots/${slotId}`,
  },

  TASKS: {
    ADD_TASK: (slotId: string) => `/slots/${slotId}/tasks`,
    EDIT_TASK: (slotId: string, taskId: string) =>
      `/slots/${slotId}/tasks/${taskId}`,
    DELETE_TASK: (slotId: string, taskId: string) =>
      `/slots/${slotId}/tasks/${taskId}`,
    TOGGLE_TASK: (slotId: string, taskId: string) =>
      `/slots/${slotId}/tasks/${taskId}/toggle`,
  },

  BOOKS: {
    GET_ALL: "/books",
    CREATE: "/books",
    GET_ONE: (bookId: string) => `/books/${bookId}`,
    EDIT: (bookId: string) => `/books/${bookId}`,
    DELETE: (bookId: string) => `/books/${bookId}`,
  },

  SECTIONS: {
    GET_BY_BOOK: (bookId: string) => `/books/${bookId}/sections`,
    CREATE: (bookId: string) => `/books/${bookId}/sections`,
    EDIT: (sectionId: string) => `/sections/${sectionId}`,
    DELETE: (sectionId: string) => `/sections/${sectionId}`,
  },

  CHAPTERS: {
    GET_BY_SECTION: (sectionId: string) => `/sections/${sectionId}/chapters`,
    CREATE: (sectionId: string) => `/sections/${sectionId}/chapters`,
    EDIT: (chapterId: string) => `/chapters/${chapterId}`,
    DELETE: (chapterId: string) => `/chapters/${chapterId}`,
  },

  TOPICS: {
    GET_BY_CHAPTER: (chapterId: string) => `/chapters/${chapterId}/topics`,
    CREATE: (chapterId: string) => `/chapters/${chapterId}/topics`,
    EDIT: (topicId: string) => `/topics/${topicId}`,
    DELETE: (topicId: string) => `/topics/${topicId}`,
    TOGGLE: (topicId: string) => `/topics/${topicId}/toggle`,
  },

  EXAMS: {
    GET_ALL: "/exams",
    CREATE: "/exams",
    EDIT: (examId: string) => `/exams/${examId}`,
    DELETE: (examId: string) => `/exams/${examId}`,
    GET_NEXT: "/exams/next",
  },

  PROGRESS: {
    OVERVIEW: "/progress/overview",
    BOOK_PROGRESS: (bookId: string) => `/progress/book/${bookId}`,
  },
} as const;
