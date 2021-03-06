import React from 'react'
import {JsonParse} from "../../utils/helper";

export type TUserSetting = {
  isMute: boolean
  gameBackgroundUrl: string
}

export class UserSetting {
  private static lsKey = "UserSetting"
  private static _instance?: UserSetting;

  private constructor() {
    if (UserSetting._instance)
      throw new Error("Use UserSetting.instance instead of new.");
    this.readLS()
    UserSetting._instance = this;
  }

  static get instance() {
    return UserSetting._instance ?? (UserSetting._instance = new UserSetting());
  }

  private readLS() {
    if (typeof window !== 'undefined') {
      const ls = window.localStorage.getItem(UserSetting.lsKey)
      if (ls) {
        const setting = JsonParse(
          ls
        ) as TUserSetting
        this._isMute = setting.isMute
        if (setting.gameBackgroundUrl.length)
          this._gameBackgroundUrl = setting.gameBackgroundUrl
      }  // client-side-only code
    }
  }

  private writeLS() {
    if (typeof window !== 'undefined') {
      const setting: TUserSetting = {
        isMute: this.isMute,
        gameBackgroundUrl: this.gameBackgroundUrl
      }
      console.log("=>(useUserSetting.tsx:103) luu setting", setting);
      window.localStorage.setItem(UserSetting.lsKey, JSON.stringify(setting))
    }
  }

  private _isMute: boolean = false;
  get isMute(): boolean {
    return this._isMute;
  }

  set isMute(value: boolean) {
    this._isMute = value;
    this.writeLS()
  }

  private _gameBackgroundUrl: string = '/assets/default-game-bg.svg';
  get gameBackgroundUrl(): string {
    return this._gameBackgroundUrl;
  }

  set gameBackgroundUrl(value: string) {
    this._gameBackgroundUrl = value;
    this.writeLS()
  }

}

export const useUserSetting = () => UserSetting.instance