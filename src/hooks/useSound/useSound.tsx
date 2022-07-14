import React from 'react'

import {Howl} from "howler";
import {SOUND_EFFECT} from "../../utils/constants";
import {UserSetting} from "../useUserSetting/useUserSetting";

export class SoundManager {
  private static _instance?: SoundManager;

  private constructor() {
    if (SoundManager._instance)
      throw new Error("Use SoundManager.instance instead of new.");
    this.isMute = UserSetting.instance.isMute;
    SoundManager._instance = this;
  }

  static get instance() {
    return SoundManager._instance ?? (SoundManager._instance = new SoundManager());
  }

  isMute = false;
  gameSoundOn = false;
  gameSound = new Howl({
    src: SOUND_EFFECT['GAME_PLAYING_2'],
    html5: true,
    loop: true,
    volume: 0.2,
  });

  private playGameSound() {
    if (!this.isMute && this.gameSoundOn && !this.gameSound.playing()) {
      this.gameSound.play()
    } else {
      this.gameSound.pause()
    }
  }

  public setGameSoundOn(on: boolean) {
    this.gameSoundOn = on;
    this.playGameSound()
  }

  public turnSound(mute: boolean) {
    this.isMute = mute
    UserSetting.instance.isMute = mute;
    this.playGameSound()
  }

  public playSound(src: string) {
    if (!this.isMute) {
      const sound = new Howl({
        src,
        html5: true,
      })
      sound?.play()
    }
  }

  public playSoundWithLoop(src: string) {
    if (this.isMute) return;
    const sound = new Howl({
      src,
      html5: true,
      loop: true,
    })
    sound?.play()
  }

  public playRandomCorrectAnswerSound() {
    if (this.isMute) return;
    const min = Math.ceil(1);
    const max = Math.floor(4);
    const randomNum = Math.floor(Math.random() * (max - min) + min);
    const url = "/sounds/correct_answer_" + randomNum + ".mp3";
    const sound_pronuncia = new Howl({
      src: url,
      html5: true,
    })

    const sound_bell = new Howl({
      src: SOUND_EFFECT['BUY_BUTTON_SOUND_CLICK'],
      html5: true,
    })
    sound_bell.play();
    sound_pronuncia.play();
  }
}

export const useSound = () => SoundManager.instance
