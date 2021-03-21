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

const roomCodeValidation = {
  required: 'Room code must be provided',
  maxLength: {
    value: 6,
    message: 'Room codes are 6 digits long'
  },
  minLength: {
    value: 6,
    message: 'Room codes are 6 digits long'
  },
  pattern: {
    value: /^\d+$/,
    message: 'Room codes only contain numbers'
  }
};

const messageValidation = {
  required: true,
  maxLength: {
    value: 100,
    message: 'Message must be less than 100 characters'
  }
};

export { loginValidation, roomNameValidation, roomCodeValidation, messageValidation };
