type AudioListener = (muted: boolean, bgmPlaying: boolean) => void;

class SoundPool {
  private pool: HTMLAudioElement[] = [];
  private poolIndex = 0;
  private baseVolume: number;

  constructor(src: string, baseVolume: number = 0.8, poolSize: number = 4) {
    this.baseVolume = baseVolume;
    for (let i = 0; i < poolSize; i++) {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = baseVolume;
      this.pool.push(audio);
    }
  }

  public play(isMuted: boolean) {
    if (isMuted) return;
    try {
      const sound = this.pool[this.poolIndex];
      this.poolIndex = (this.poolIndex + 1) % this.pool.length;
      sound.currentTime = 0;
      sound.volume = this.baseVolume;
      const promise = sound.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // Ignore autoplay restriction errors before user gesture
        });
      }
    } catch {
      // Audio playback safety catch
    }
  }
}

class AudioManager {
  private diceSound: SoundPool;
  private moveSound: SoundPool;
  private moneySound: SoundPool;
  private chanceSound: SoundPool;
  private chestSound: SoundPool;

  private bgmAudio: HTMLAudioElement;
  private _isMuted: boolean = false;
  private _bgmPlaying: boolean = false;
  private listeners: Set<AudioListener> = new Set();

  constructor() {
    // Check saved preferences
    const savedMute = localStorage.getItem('landgrab_audio_muted');
    if (savedMute !== null) {
      this._isMuted = savedMute === 'true';
    }

    // Initialize sound pools for concurrent/rapid playback
    this.diceSound = new SoundPool('/sound/freesound_community-dice-95077.mp3', 0.85, 3);
    this.moveSound = new SoundPool('/sound/move.mp3', 0.75, 4);
    this.moneySound = new SoundPool('/sound/money-spent-or-got.mp3', 0.9, 3);
    this.chanceSound = new SoundPool('/sound/chance.mp3', 0.85, 2);
    this.chestSound = new SoundPool('/sound/communitychest.mp3', 0.85, 2);

    // Initialize background music
    this.bgmAudio = new Audio('/sound/background-looping.mp3');
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = this._isMuted ? 0 : 0.22;
    this.bgmAudio.preload = 'auto';

    this.bgmAudio.addEventListener('play', () => {
      this._bgmPlaying = true;
      this.notifyListeners();
    });

    this.bgmAudio.addEventListener('pause', () => {
      this._bgmPlaying = false;
      this.notifyListeners();
    });

    // Auto-unlock audio on first user click anywhere in the window
    const unlockHandler = () => {
      window.removeEventListener('pointerdown', unlockHandler);
      window.removeEventListener('keydown', unlockHandler);
      // If BGM was desired and not muted, start it
      if (!this._isMuted && !this._bgmPlaying) {
        this.startBgm();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('pointerdown', unlockHandler, { once: true });
      window.addEventListener('keydown', unlockHandler, { once: true });
    }
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener(this._isMuted, this._bgmPlaying);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      listener(this._isMuted, this._bgmPlaying);
    }
  }

  public playDice() {
    this.diceSound.play(this._isMuted);
  }

  public playMove() {
    this.moveSound.play(this._isMuted);
  }

  public playMoney() {
    this.moneySound.play(this._isMuted);
  }

  public playChance() {
    this.chanceSound.play(this._isMuted);
  }

  public playChest() {
    this.chestSound.play(this._isMuted);
  }

  public startBgm() {
    if (this._isMuted) return;
    this.bgmAudio.volume = 0.22;
    this.bgmAudio.play().catch(() => {
      // Handled by user gesture listener
    });
  }

  public stopBgm() {
    this.bgmAudio.pause();
  }

  public toggleBgm() {
    if (this._bgmPlaying) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
  }

  public toggleMute() {
    this._isMuted = !this._isMuted;
    localStorage.setItem('landgrab_audio_muted', String(this._isMuted));

    if (this._isMuted) {
      this.bgmAudio.pause();
    } else {
      this.startBgm();
    }

    this.notifyListeners();
  }

  public get isMuted(): boolean {
    return this._isMuted;
  }

  public get isBgmPlaying(): boolean {
    return this._bgmPlaying;
  }
}

export const audioManager = new AudioManager();
