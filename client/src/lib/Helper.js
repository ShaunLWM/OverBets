const COLORS = ["#FE8656", "#C39F06", "#00A550", "#70A1C5", "#d32ce6", "#8847ff", "#4b69ff"];

module.exports = {
    getRandomColor() {
        return COLORS[Math.floor(Math.random() * COLORS.length)];
    }
}
