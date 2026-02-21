export const ROUTES = {
  AUTH: {
    SEND_OTP: '/auth/send-otp',
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    ME: '/auth/me',
    GOOGLE_LOGIN: '/auth/google',
  },

  DASHBOARD: {
    GET_SLOTS: '/slots',
    CREATE_SLOT: '/slots',
    EDIT_SLOT: '/slots/:slotId',
    DELETE_SLOT: '/slots/:slotId',
  },

  TASKS: {
    ADD_TASK: '/slots/:slotId/tasks',
    EDIT_TASK: '/slots/:slotId/tasks/:taskId',
    DELETE_TASK: '/slots/:slotId/tasks/:taskId',
    TOGGLE_TASK: '/slots/:slotId/tasks/:taskId/toggle',
  },

  BOOKS: {
    GET_ALL: '/books',
    CREATE: '/books',
    GET_ONE: '/books/:bookId',
    EDIT: '/books/:bookId',
    DELETE: '/books/:bookId',
  },

  SECTIONS: {
    GET_BY_BOOK: '/books/:bookId/sections',
    CREATE: '/books/:bookId/sections',
    EDIT: '/sections/:sectionId',
    DELETE: '/sections/:sectionId',
  },

  CHAPTERS: {
    GET_BY_SECTION: '/sections/:sectionId/chapters',
    CREATE: '/sections/:sectionId/chapters',
    EDIT: '/chapters/:chapterId',
    DELETE: '/chapters/:chapterId',
  },

  TOPICS: {
    GET_BY_CHAPTER: '/chapters/:chapterId/topics',
    CREATE: '/chapters/:chapterId/topics',
    EDIT: '/topics/:topicId',
    DELETE: '/topics/:topicId',
    TOGGLE: '/topics/:topicId/toggle',
  },

  EXAMS: {
    GET_ALL: '/exams',
    CREATE: '/exams',
    EDIT: '/:examId',
    DELETE: '/:examId',
    GET_NEXT: '/next',
  },

  PROGRESS: {
    OVERVIEW: '/overview',
    BOOK_PROGRESS: '/book/:bookId',
  },
} as const;
