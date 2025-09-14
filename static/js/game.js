// Additional JavaScript utilities for Squirrel Dash

// Game utilities
const GameUtils = {
    // Format large numbers with commas
    formatNumber: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Generate random number between min and max
    randomBetween: (min, max) => {
        return Math.random() * (max - min) + min;
    },

    // Check if two objects are colliding
    checkCollision: (obj1, obj2, threshold = 0.8) => {
        const dx = obj1.position.x - obj2.position.x;
        const dz = obj1.position.z - obj2.position.z;
        return Math.sqrt(dx * dx + dz * dz) < threshold;
    },

    // Lerp function for smooth movement
    lerp: (start, end, factor) => {
        return start + (end - start) * factor;
    },

    // Clamp value between min and max
    clamp: (value, min, max) => {
        return Math.min(Math.max(value, min), max);
    }
};

// Sound effects (using Web Audio API)
const SoundManager = {
    audioContext: null,
    sounds: {},

    init: () => {
        try {
            SoundManager.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    },

    playSound: (frequency, duration, type = 'sine') => {
        if (!SoundManager.audioContext) return;

        const oscillator = SoundManager.audioContext.createOscillator();
        const gainNode = SoundManager.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(SoundManager.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.1, SoundManager.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, SoundManager.audioContext.currentTime + duration);

        oscillator.start(SoundManager.audioContext.currentTime);
        oscillator.stop(SoundManager.audioContext.currentTime + duration);
    },

    playJump: () => {
        SoundManager.playSound(800, 0.1, 'sine');
    },

    playCollect: () => {
        SoundManager.playSound(1200, 0.2, 'sine');
    },

    playCollision: () => {
        SoundManager.playSound(200, 0.5, 'sawtooth');
    }
};

// Performance monitoring
const PerformanceMonitor = {
    frameCount: 0,
    lastTime: 0,
    fps: 0,

    update: () => {
        PerformanceMonitor.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - PerformanceMonitor.lastTime >= 1000) {
            PerformanceMonitor.fps = PerformanceMonitor.frameCount;
            PerformanceMonitor.frameCount = 0;
            PerformanceMonitor.lastTime = currentTime;
        }
    },

    getFPS: () => PerformanceMonitor.fps
};

// Local storage for game settings
const GameSettings = {
    load: () => {
        try {
            const settings = localStorage.getItem('squirrelDashSettings');
            return settings ? JSON.parse(settings) : {
                soundEnabled: true,
                highScore: 0,
                totalGames: 0,
                totalDistance: 0
            };
        } catch (e) {
            return {
                soundEnabled: true,
                highScore: 0,
                totalGames: 0,
                totalDistance: 0
            };
        }
    },

    save: (settings) => {
        try {
            localStorage.setItem('squirrelDashSettings', JSON.stringify(settings));
        } catch (e) {
            console.log('Could not save settings to localStorage');
        }
    },

    updateHighScore: (score) => {
        const settings = GameSettings.load();
        if (score > settings.highScore) {
            settings.highScore = score;
            GameSettings.save(settings);
            return true;
        }
        return false;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    SoundManager.init();
    
    // Load and apply settings
    const settings = GameSettings.load();
    if (!settings.soundEnabled) {
        // Disable sound if user has disabled it
        SoundManager.audioContext = null;
    }
});

// Export for use in other scripts
window.GameUtils = GameUtils;
window.SoundManager = SoundManager;
window.PerformanceMonitor = PerformanceMonitor;
window.GameSettings = GameSettings;
