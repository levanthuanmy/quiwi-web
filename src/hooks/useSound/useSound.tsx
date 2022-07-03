import {useEffect, useState} from 'react'
import {useUserSetting} from "../useUserSetting/useUserSetting";
import {Howl} from "howler";
import {SOUND_EFFECT} from "../../utils/constants";
import {singletonHook} from "react-singleton-hook";

const init = {
  isMute:false,
  turnSound: (on: boolean) => {},
  playSound:  (src: string) => {},
  playSoundWithLoop: (src: string) => {},
  playRandomCorrectAnswerSound: () => {},
  setGameSoundOn: () => {},
}

const _useSound = () => {
  const {isMute, setIsMute} = useUserSetting()
  const [gameSoundOn, setGameSoundOn] = useState<boolean>(false)
  const [gameSound, setGameSound] = useState<Howl>(
    new Howl({
      src: SOUND_EFFECT['GAME_PLAYING'],
      html5: true,
      loop: true
    })
  );

  useEffect(() => {

  }, [isMute]);

  useEffect(() => {
    if (!isMute && gameSoundOn && !gameSound.playing()) {
      console.log("=>(useSound.tsx:24) playsound", gameSound);
      gameSound.play()
    } else {
      console.log("=>(useSound.tsx:24) offsound", gameSound);
      gameSound.pause()
    }
  }, [isMute, gameSoundOn]);

  const turnSound = (on: boolean) => {
    setIsMute(!on)
  }

  const playSound = (src: string) => {
    console.log("=>(useSound.tsx:24) isMute", isMute, src);
    if (isMute) return;
    const sound = new Howl({
      src,
      html5: true,
    })
    sound?.play()
  }

  const playSoundWithLoop = (src: string) => {
    if (isMute) return;
    const sound = new Howl({
      src,
      html5: true,
      loop: true
    })
    sound?.play()
  }

  const playRandomCorrectAnswerSound = () => {
    console.log("=>(useSound.tsx:73) isMute", isMute);
    if (isMute) return;
    const min = Math.ceil(1);
    const max = Math.floor(4);
    const randomNum = Math.floor(Math.random() * (max - min) + min);
    const url = "/sounds/correct_answer_" + randomNum + ".mp3";
    console.log("=>(useSound.tsx:73) url", url);
    const sound_pronuncia = new Howl({
      src: url,
      html5: true,
    })

    const sound_bell = new Howl({
      src: SOUND_EFFECT["BUY_BUTTON_SOUND_CLICK"],
      html5: true,
    })
    console.log("=>(useSound.tsx:88) sound_bell", sound_bell);
    sound_bell.play();
    sound_pronuncia.play();
  }

  return ({
    isMute,
    turnSound,
    playSound,
    playSoundWithLoop,
    playRandomCorrectAnswerSound,
    setGameSoundOn
  })
}

export const useSound = singletonHook(init, _useSound);