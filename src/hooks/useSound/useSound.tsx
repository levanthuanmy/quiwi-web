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
    loop: true
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
    console.log("playSound isMute", this.isMute, src);
    if (!this.isMute) {
      const sound = new Howl({
        src,
        html5: true,
      })
      sound?.play()
    }
  }

  public playSoundWithLoop(src: string) {
    console.log("playSoundWithLoop isMute", this.isMute);
    if (this.isMute) return;
    const sound = new Howl({
      src,
      html5: true,
      loop: true,
    })
    sound?.play()
  }

  public playRandomCorrectAnswerSound() {
    console.log("playRandomCorrectAnswerSound isMute", this.isMute);
    if (this.isMute) return;
    const min = Math.ceil(1);
    const max = Math.floor(4);
    const randomNum = Math.floor(Math.random() * (max - min) + min);
    const url = "/sounds/correct_answer_" + randomNum + ".mp3";
    console.log("playRandomCorrectAnswerSound url", url);
    const sound_pronuncia = new Howl({
      src: url,
      html5: true,
    })

    const sound_bell = new Howl({
      src: SOUND_EFFECT['BUY_BUTTON_SOUND_CLICK'],
      html5: true,
    })
    console.log("playRandomCorrectAnswerSound sound_bell", sound_bell);
    sound_bell.play();
    sound_pronuncia.play();
  }
}

export const useSound = () => SoundManager.instance
