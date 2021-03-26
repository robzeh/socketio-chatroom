// login form validation 
const loginValidation = {
  required: 'Username must be provided',
  maxLength: {
    value: 20,
    message: 'Username must be less than 20 characters'
  },
  pattern: {
    value: /^[\w\-\.\s]+$/,
    message: 'Username can\'t contain special characters'
  },
};

const roomNameValidation = {
  required: 'Room name must be provided',
  maxLength: {
    value: 20,
    message: 'Room name must be less than 20 characters'
  },
  pattern: {
    value: /^[\w\-\.\'\s]+$/,
    message: 'Room name can\'t contain special characters'
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
