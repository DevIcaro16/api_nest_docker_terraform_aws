interface UserProps {
    name: string;
    email: string;
    password: string;
}
type UserUpdate = Partial<User> & UserProps;
export declare class User {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly createdAt: Date;
    password: string;
    updatedAt: Date;
    constructor(init: UserUpdate);
}
export {};
