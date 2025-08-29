const palette = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FED766', // Yellow
  '#F0B86E', // Orange
  '#9B5DE5', // Purple
  '#F15BB5', // Pink
  '#00F5D4', // Bright Teal
  '#A2D2FF', // Light Blue
  '#FFCDB2', // Peach
  '#CDB4DB', // Lavender
  '#83C5BE', // Pale Teal
];

let lastColorIndex = -1;

export const getRandomColor = (): string => {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * palette.length);
  } while (palette.length > 1 && randomIndex === lastColorIndex);
  
  lastColorIndex = randomIndex;
  return palette[randomIndex];
};
