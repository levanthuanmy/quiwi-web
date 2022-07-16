import React from 'react'
import {JsonParse} from "../../utils/helper";
import {TUser} from "../../types/types";


export class User {
  private static lsKey = "user"
  private static _instance?: User;

  private _user: TUser | null;
  get user(): TUser | null {
    return this._user;
  }
  set user(value: TUser | null) {
    this._user = value;
    this.writeLS()
  }

  private constructor() {
    if (User._instance)
      throw new Error("Use User.instance instead of new.");
    this._user = {} as TUser;
    this.readLS()
    User._instance = this;
  }

  static get instance() {
    return User._instance ?? (User._instance = new User());
  }

  private readLS() {
    if (typeof window !== 'undefined') {
      const ls = window.localStorage.getItem(User.lsKey)
      if (ls) {
        this._user = JsonParse(ls) as TUser;
      }
    }
  }

  private writeLS() {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(User.lsKey, JSON.stringify(this._user))
    }
  }

}

export const useUserManager = () => User.instance
export const useUser = () => User.instance.user