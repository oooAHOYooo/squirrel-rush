// Enhanced JavaScript utilities for Squirrel Dash

// Advanced Game utilities
const GameUtils = {
    // Format large numbers with commas
    formatNumber: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Generate random number between min and max
    randomBetween: (min, max) => {
        return Math.random() * (max - min) + min;
    },

    // Check if two objects are colliding with enhanced detection
    checkCollision: (obj1, obj2, threshold = 0.8) => {
        const dx = obj1.position.x - obj2.position.x;
        const dz = obj1.position.z - obj2.position.z;
        const dy = obj1.position.y - obj2.position.y;
        return Math.sqrt(dx * dx + dz * dz + dy * dy) < threshold;
    },

    // Lerp function for smooth movement
    lerp: (start, end, factor) => {
        return start + (end - start) * factor;
    },

    // Clamp value between min and max
    clamp: (value, min, max) => {
        return Math.min(Math.max(value, min), max);
    },

    // Easing functions for smooth animations
    easeInOutCubic: (t) => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },

    easeOutBounce: (t) => {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
    },

    // Generate procedural noise for terrain
    noise: (x, y, z = 0) => {
        const n = Math.sin(x * 12.9898 + y * 78.233 + z * 45.164) * 43758.5453;
        return (n - Math.floor(n)) * 2 - 1;
    },

    // Smooth noise for terrain generation
    smoothNoise: (x, y, z = 0) => {
        const corners = (GameUtils.noise(x - 1, y - 1, z) + GameUtils.noise(x + 1, y - 1, z) +
                        GameUtils.noise(x - 1, y + 1, z) + GameUtils.noise(x + 1, y + 1, z)) / 16;
        const sides = (GameUtils.noise(x - 1, y, z) + GameUtils.noise(x + 1, y, z) +
                      GameUtils.noise(x, y - 1, z) + GameUtils.noise(x, y + 1, z)) / 8;
        const center = GameUtils.noise(x, y, z) / 4;
        return corners + sides + center;
    },

    // Perlin-like noise for natural terrain
    perlinNoise: (x, y, z = 0, octaves = 4, persistence = 0.5) => {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;

        for (let i = 0; i < octaves; i++) {
            total += GameUtils.smoothNoise(x * frequency, y * frequency, z * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }

        return total / maxValue;
    }
};

// Enhanced Sound effects (using Web Audio API)
const SoundManager = {
    audioContext: null,
    sounds: {},
    masterVolume: 0.5,

    init: () => {
        try {
            SoundManager.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    },

    playSound: (frequency, duration, type = 'sine', volume = 0.1) => {
        if (!SoundManager.audioContext) return;

        const oscillator = SoundManager.audioContext.createOscillator();
        const gainNode = SoundManager.audioContext.createGain();
        const filter = SoundManager.audioContext.createBiquadFilter();

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(SoundManager.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        // Add filter for more interesting sounds
        filter.type = 'lowpass';
        filter.frequency.value = frequency * 2;

        gainNode.gain.setValueAtTime(volume * SoundManager.masterVolume, SoundManager.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, SoundManager.audioContext.currentTime + duration);

        oscillator.start(SoundManager.audioContext.currentTime);
        oscillator.stop(SoundManager.audioContext.currentTime + duration);
    },

    playJump: () => {
        // Ascending jump sound
        SoundManager.playSound(600, 0.15, 'sine', 0.2);
        setTimeout(() => SoundManager.playSound(400, 0.1, 'sine', 0.15), 50);
    },

    playCollect: () => {
        // Pleasant collect sound with harmonics
        SoundManager.playSound(800, 0.1, 'sine', 0.15);
        setTimeout(() => SoundManager.playSound(1200, 0.1, 'sine', 0.1), 30);
        setTimeout(() => SoundManager.playSound(1600, 0.1, 'sine', 0.05), 60);
    },

    playCollision: () => {
        // Dramatic collision sound
        SoundManager.playSound(150, 0.8, 'sawtooth', 0.3);
        setTimeout(() => SoundManager.playSound(100, 0.5, 'square', 0.2), 100);
    },

    playCombo: (comboLevel) => {
        // Combo sound that gets more intense
        const baseFreq = 400 + (comboLevel * 100);
        SoundManager.playSound(baseFreq, 0.2, 'sine', 0.2);
        setTimeout(() => SoundManager.playSound(baseFreq * 1.5, 0.15, 'sine', 0.15), 50);
    },

    playAmbient: () => {
        // Forest ambient sound
        const noise = SoundManager.audioContext.createBufferSource();
        const buffer = SoundManager.audioContext.createBuffer(1, SoundManager.audioContext.sampleRate * 2, SoundManager.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < data.length; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.1;
        }
        
        noise.buffer = buffer;
        noise.loop = true;
        noise.connect(SoundManager.audioContext.destination);
        noise.start();
        
        return noise;
    }
};

// Advanced Particle Systems
const ParticleSystem = {
    particles: [],
    maxParticles: 1000,

    createParticle: (position, velocity, life, color, size) => {
        return {
            position: position.clone(),
            velocity: velocity.clone(),
            life: life,
            maxLife: life,
            color: color,
            size: size,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1
        };
    },

    emit: (position, count, type = 'default') => {
        for (let i = 0; i < count; i++) {
            let particle;
            switch (type) {
                case 'sparkle':
                    particle = ParticleSystem.createParticle(
                        position,
                        new THREE.Vector3(
                            (Math.random() - 0.5) * 2,
                            Math.random() * 2 + 1,
                            (Math.random() - 0.5) * 2
                        ),
                        1.0,
                        new THREE.Color(0xffd700),
                        0.1
                    );
                    break;
                case 'leaf':
                    particle = ParticleSystem.createParticle(
                        position,
                        new THREE.Vector3(
                            (Math.random() - 0.5) * 0.5,
                            -Math.random() * 0.5,
                            (Math.random() - 0.5) * 0.5
                        ),
                        3.0,
                        new THREE.Color(0x8B4513),
                        0.2
                    );
                    break;
                case 'dust':
                    particle = ParticleSystem.createParticle(
                        position,
                        new THREE.Vector3(
                            (Math.random() - 0.5) * 0.2,
                            Math.random() * 0.1,
                            (Math.random() - 0.5) * 0.2
                        ),
                        2.0,
                        new THREE.Color(0xffffff),
                        0.05
                    );
                    break;
                default:
                    particle = ParticleSystem.createParticle(
                        position,
                        new THREE.Vector3(
                            (Math.random() - 0.5) * 1,
                            Math.random() * 1,
                            (Math.random() - 0.5) * 1
                        ),
                        1.0,
                        new THREE.Color(0xffffff),
                        0.1
                    );
            }
            ParticleSystem.particles.push(particle);
        }
    },

    update: (deltaTime) => {
        for (let i = ParticleSystem.particles.length - 1; i >= 0; i--) {
            const particle = ParticleSystem.particles[i];
            
            // Update position
            particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime));
            
            // Update rotation
            particle.rotation += particle.rotationSpeed * deltaTime;
            
            // Update life
            particle.life -= deltaTime;
            
            // Apply gravity to some particles
            if (particle.type === 'leaf' || particle.type === 'dust') {
                particle.velocity.y -= 0.5 * deltaTime;
            }
            
            // Remove dead particles
            if (particle.life <= 0) {
                ParticleSystem.particles.splice(i, 1);
            }
        }
    },

    render: (scene) => {
        // This would be implemented with instanced rendering for performance
        // For now, we'll use individual meshes
        ParticleSystem.particles.forEach(particle => {
            const geometry = new THREE.SphereGeometry(particle.size, 4, 4);
            const material = new THREE.MeshBasicMaterial({
                color: particle.color,
                transparent: true,
                opacity: particle.life / particle.maxLife
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(particle.position);
            mesh.rotation.z = particle.rotation;
            scene.add(mesh);
            
            // Remove after one frame
            setTimeout(() => scene.remove(mesh), 16);
        });
    }
};

// Visual Effects Manager
const VisualEffects = {
    screenShake: { x: 0, y: 0, z: 0, duration: 0 },
    slowMotion: { active: false, factor: 1.0 },
    bloom: { active: false, intensity: 1.0 },

    addScreenShake: (intensity, duration) => {
        VisualEffects.screenShake.x = intensity;
        VisualEffects.screenShake.y = intensity;
        VisualEffects.screenShake.z = intensity;
        VisualEffects.screenShake.duration = duration;
    },

    updateScreenShake: (deltaTime) => {
        if (VisualEffects.screenShake.duration > 0) {
            VisualEffects.screenShake.duration -= deltaTime;
            const factor = VisualEffects.screenShake.duration / 0.5; // Assuming 0.5s max duration
            VisualEffects.screenShake.x *= factor;
            VisualEffects.screenShake.y *= factor;
            VisualEffects.screenShake.z *= factor;
        } else {
            VisualEffects.screenShake.x = 0;
            VisualEffects.screenShake.y = 0;
            VisualEffects.screenShake.z = 0;
        }
    },

    addSlowMotion: (factor, duration) => {
        VisualEffects.slowMotion.active = true;
        VisualEffects.slowMotion.factor = factor;
        setTimeout(() => {
            VisualEffects.slowMotion.active = false;
            VisualEffects.slowMotion.factor = 1.0;
        }, duration);
    },

    addBloom: (intensity, duration) => {
        VisualEffects.bloom.active = true;
        VisualEffects.bloom.intensity = intensity;
        setTimeout(() => {
            VisualEffects.bloom.active = false;
            VisualEffects.bloom.intensity = 1.0;
        }, duration);
    }
};

// Performance monitoring
const PerformanceMonitor = {
    frameCount: 0,
    lastTime: 0,
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,

    update: () => {
        PerformanceMonitor.frameCount++;
        const currentTime = performance.now();
        PerformanceMonitor.frameTime = currentTime - PerformanceMonitor.lastTime;
        
        if (currentTime - PerformanceMonitor.lastTime >= 1000) {
            PerformanceMonitor.fps = PerformanceMonitor.frameCount;
            PerformanceMonitor.frameCount = 0;
            PerformanceMonitor.lastTime = currentTime;
            
            // Get memory usage if available
            if (performance.memory) {
                PerformanceMonitor.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
            }
        }
    },

    getFPS: () => PerformanceMonitor.fps,
    getFrameTime: () => PerformanceMonitor.frameTime,
    getMemoryUsage: () => PerformanceMonitor.memoryUsage,

    // Adaptive quality based on performance
    getQualityLevel: () => {
        if (PerformanceMonitor.fps < 30) return 'low';
        if (PerformanceMonitor.fps < 45) return 'medium';
        return 'high';
    }
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
