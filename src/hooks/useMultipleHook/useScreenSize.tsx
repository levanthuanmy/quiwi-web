import React from 'react'
import {UserSettingContext} from "../useUserSetting/useUserSetting";
import {SoundContext} from "../useSound/useSound";

export default function useCustomHooks() {
  const userSetting = React.useContext(UserSettingContext);
  const sound = React.useContext(SoundContext);

  return ({userSetting, sound})
}
