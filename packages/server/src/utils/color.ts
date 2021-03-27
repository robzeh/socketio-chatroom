const colors = ['gray', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'cyan', 'purple', 'pink'];

const getColor = () => Math.floor(Math.random() * Math.floor(colors.length));

export { colors, getColor };

