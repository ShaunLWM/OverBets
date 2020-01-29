const COLORS = ["#FE8656", "#C39F06", "#00A550", "#70A1C5", "#d32ce6", "#8847ff", "#4b69ff"];

export function getRandomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
