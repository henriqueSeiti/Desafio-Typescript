import { IUser } from "../interfaces/interfaces";
import { v4 } from "uuid";

export default class User {
  #id;
  #username;
  #email;
  #password;
  #first_name;
  #last_name;
  #squad;
  #is_admin;

  constructor(data: IUser) {
    this.#id = this.createId();
    this.#username = data.username;
    this.#email = data.email;
    this.#password = data.password;

    this.#first_name = data.first_name ?? "";
    this.#last_name = data.last_name ?? "";
    this.#squad = data.squad ?? null;
    this.#is_admin = data.is_admin ?? false;
  }

  get username() {
    return this.#username;
  }

  get email() {
    return this.#email;
  }

  get id() {
    return this.#id;
  }

  get password() {
    return this.#password;
  }

  get first_name() {
    return this.#first_name;
  }

  get last_name() {
    return this.#last_name;
  }

  get squad() {
    return this.#squad;
  }

  get is_admin() {
    return this.#is_admin;
  }

  private createId() {
    const id = v4();
    return id;
  }
}
