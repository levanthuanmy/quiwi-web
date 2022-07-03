import {useEffect, useState} from 'react'
import {defaultStyles} from 'react-select/dist/declarations/src/styles';
import {useLocalStorage} from "../useLocalStorage/useLocalStorage";
import {TGameModeEnum, TGameRoundStatistic, TGameStatus, TPlayer, TQuiz, TUser} from "../../types/types";
import {JsonParse} from "../../utils/helper";
import {singletonHook} from "react-singleton-hook";
import { string } from 'yup';

export type TUserSetting = {
  isMute: boolean
  gameBackgroundUrl: string
}

const init = {
  isMute: false,
  setIsMute: () => {},
  gameBackgroundUrl: "",
  setGameBackgroundUrl: () => {}
}

const _useUserSetting = () => {
  const [lsSetting, setLsSettings] = useLocalStorage("userSettings", '');
  const [isMute, setIsMute] = useState<boolean>(false)
  const [gameBackgroundUrl, setGameBackgroundUrl] = useState<string>("")

  useEffect(() => {
    console.log("=>(useUserSetting.tsx:28) init Setting");
    const settings: TUserSetting = JsonParse(lsSetting)
    if (settings) {
      console.log("=>(useUserSetting.tsx:27) settings", settings);
      setIsMute(settings.isMute)
      setGameBackgroundUrl(settings.gameBackgroundUrl)
    }
  }, [])

  useEffect(() => {
    const settings: TUserSetting = {
      isMute,
      gameBackgroundUrl
    }
    const jsonSetting = JSON.stringify(settings)
    if (jsonSetting
      && jsonSetting != lsSetting
      && jsonSetting !== lsSetting) {
      setLsSettings(jsonSetting)
    }
  }, [isMute, gameBackgroundUrl])

  return ({
    isMute,
    setIsMute,
    gameBackgroundUrl,
    setGameBackgroundUrl
  })
}

export const useUserSetting = singletonHook(init, _useUserSetting);