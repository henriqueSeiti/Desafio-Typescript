import { v4 as uuidv4 } from "uuid";

abstract class Validate {
    public fail: boolean = false;
    public message: string;

    constructor() {
        this.message = "[validate]: Validado!";
    }

    protected testData(data: string, _message: string, regex: RegExp) {
        if (!regex.test(data)) {
            this.message = _message;
            this.fail = true;
        }
    }
}

export class Validator extends Validate {
    constructor( username: string, first_name: string, last_name: string, password: string, email: string, ) {
        super();
        this.validateUsername(username);
        this.validateFirstName(first_name);
        this.validateLastName(last_name);
        this.validatePassword(password);
        this.validateEmail(email);
    }

    private validateUsername(username: string) {
        const regex = /^[a-zA-Z0-9_-]{3,16}$/;
        if (!this.fail)
            this.testData(username, "[username]: O username está inválido", regex);
    }

    private validateFirstName(firstName: string) {
        const regex = /^[a-zA-Zà-úÀ-Ú ]+$/;
        if (!this.fail)
            this.testData(firstName, "[first name]: O first_name está inválido", regex);
    }

    private validateLastName(lastName: string) {
        const regex = /^[a-zA-Zà-úÀ-Ú ]+$/;
        if (!this.fail)
            this.testData(lastName, "[last name]: O last_name está inválido", regex);
    }

    private validatePassword(password: string) {
        const regex = /^\w{1,}$/gim;
        if (!this.fail)
            this.testData(password, "[password]: O password está inválido", regex);
    }

    private validateEmail(email: string) {
        const regex = /^(\w{1,}@\w{1,}\.(\w{3})(\.\w{2}){0,1})$/gim;
        if (!this.fail)
            this.testData(email, "[e-mail]: O email está inválido", regex);
    }
}

export class SquadValidator extends Validate {
    constructor(nameSquad: string, leader?: string) {
        super();
        this.validateNameSquad(nameSquad);
        if (leader) {
            this.validateLeader(leader);
        }
    }

    private validateNameSquad(nameSquad: string) {
        const regex = /^[a-zA-Zà-úÀ-Ú ]+$/;
        if (!this.fail)
            this.testData(nameSquad, "[Name Squad]: O nameSquad está inválido", regex);
    }

    private validateLeader(leader: string) {
        const regex = new RegExp(uuidv4());
        if (!this.fail)
            this.testData(leader, "[leader]: O leader está inválido", regex);
    }
}