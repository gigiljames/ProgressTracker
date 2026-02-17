export const ROUTES = {
  AUTH: {
    SEND_OTP: '/send-otp',
    SIGNUP: '/signup',
    LOGIN: '/login',
    LOGOUT: '/logout',
    REFRESH_TOKEN: '/refresh-token',
    ME: '/me',
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
    GET_ALL: '/',
    CREATE: '/',
    GET_ONE: '/:bookId',
    EDIT: '/:bookId',
    DELETE: '/:bookId',
  },

  SECTIONS: {
    GET_BY_BOOK: '/:bookId/sections',
    CREATE: '/:bookId/sections',
    EDIT: '/:sectionId',
    DELETE: '/:sectionId',
  },

  CHAPTERS: {
    GET_BY_SECTION: '/:sectionId/chapters',
    CREATE: '/:sectionId/chapters',
    EDIT: '/:chapterId',
    DELETE: '/:chapterId',
  },

  TOPICS: {
    GET_BY_CHAPTER: '/:chapterId/topics',
    CREATE: '/:chapterId/topics',
    EDIT: '/:topicId',
    DELETE: '/:topicId',
    TOGGLE: '/:topicId/toggle',
  },

  EXAMS: {
    GET_ALL: '/',
    CREATE: '/',
    EDIT: '/:examId',
    DELETE: '/:examId',
    GET_NEXT: '/next',
  },

  PROGRESS: {
    OVERVIEW: '/overview',
    BOOK_PROGRESS: '/book/:bookId',
  },
} as const;
