import { FormControl } from "@angular/forms";

export interface ISignupPostData {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export interface ILoginPostData extends Omit<ISignupPostData, 'firstName' | 'lastName'> { }