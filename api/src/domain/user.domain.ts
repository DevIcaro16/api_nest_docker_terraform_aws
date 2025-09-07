import { randomUUID } from "crypto";

interface UserProps {
    name: string;
    email: string;
    password: string;
}

type UserUpdate = Partial<User> & UserProps;

export class User {

    public readonly id: string = '';
    public readonly name: string = '';
    public readonly email: string  = '';
    public readonly createdAt: Date = new Date();
    public password: string = '';
    public updatedAt: Date = new Date();

    constructor(init: UserUpdate ) {
        Object.assign(this,
             {
                id: randomUUID(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
         init
        );
    }
}