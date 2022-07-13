import {GameManager} from "../useGameSession/useGameSession";

export class MyLeGameManager extends GameManager {
  override get key(): string {
    return "MYLE-";
  }

}


class MyLeGameManagerSingleton extends MyLeGameManager {
  private static _instance?: MyLeGameManagerSingleton;

  constructor() {
    if (MyLeGameManagerSingleton._instance)
      throw new Error("Use MyLeGameManagerSingleton.instance instead of new.");
    super();
    MyLeGameManagerSingleton._instance = this;
  }

  static get instance() {
    return MyLeGameManagerSingleton._instance ?? (MyLeGameManagerSingleton._instance = new MyLeGameManagerSingleton());
  }
}

export const useGameSession = () => MyLeGameManagerSingleton.instance