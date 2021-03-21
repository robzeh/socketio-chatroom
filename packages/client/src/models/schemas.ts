// login form validation 
const loginValidation = {
  required: 'Username must be provided',
  maxLength: {
    value: 20,
    message: 'Username must be less than 20 characters'
  },
  pattern: {
    value: /^[\w\-\.\s]+$/,
    message: 'Username must only contain alphanumeric characters, spaces, underscores, dashes or periods'
  },
};

const roomNameValidation = {
  required: 'Roomname must be provided',
  maxLength: {
    value: 20,
    message: 'Roomname must be less than 20 characters'
  },
  pattern: {
    value: /^[\w\-\.\s]+$/,
    message: 'Roomname must only contain alphanumeric characters, spaces, underscores, dashes or periods'
  },
};

export { loginValidation, roomNameValidation };