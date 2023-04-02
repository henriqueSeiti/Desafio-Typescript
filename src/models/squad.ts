import { ISquad } from "../interfaces/interfaces";
import { v4 } from "uuid";

export default class Squad {
  #name;
  #leader;
  #id;

  constructor(data: ISquad) {
    this.#name = data.name;
    this.#leader = data.leader;
    this.#id = this.createId();
  }

  get name() {
    return this.#name;
  }

  get email() {
    return this.#leader;
  }

  get id() {
    return this.#id;
  }

  private createId() {
    const id = v4();
    return id;
  }
}
