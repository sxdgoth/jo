class MouthToneManager {
    constructor() {
        this.mouthTones = {
            light: ['#FFF4F2', '#FFD1CC'],
            medium: ['#FFE0D4', '#FFBDB0'],
            tan: ['#FFCEB5', '#FFAA8D'],
            dark: ['#A66A5E', '#8C4B3C']
        };
    }

    getMouthTone(skinTone) {
        return this.mouthTones[skinTone] || this.mouthTones.light;
    }
}

// Create a global instance
window.mouthToneManager = new MouthToneManager();
