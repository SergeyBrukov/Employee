import {TEmployees, TTodo} from "./type";

export const enum MayRole {
    OWNER = "OWNER",
    EMPLOYEE = "EMPLOYEE"
}

export interface IRouter {
    path: string,
    role: MayRole[] | null,
    element: string
}

export interface ILoginForm {
    email: string,
    password: string
}

export interface IRegisterForm extends ILoginForm {
    name: string
}

export interface IRegisterEmployeeForm extends ILoginForm {}

export interface ILoginDataReq extends ILoginForm {
}

export interface ILoginDataRes {
    token: string,
    role: string,
    name: string
    status: number
}

export interface IRegisterDataReq extends IRegisterForm {
}

export interface IRegisterDataRes extends ILoginDataRes {
}

export interface IRegisterEmployeeDataReq extends Omit<IRegisterForm, "name"> {
    token: string
}

export interface IEmployeesDataRes {
    employees: TEmployees[],
    totalPage: number
}

export interface IConfirmationModal {
    title?: string,
    description: string,
    loading: boolean,
    open: boolean,
    setOpen: (state: boolean) => void,
    handler: () => void
}


export interface ICreateEmployeeFrom {
    age: string,
    address: string,
    firstName: string,
    lastName: string
    email: string
}

export interface IEmployeeDetailInfoRes extends TEmployees {
    id: string
}


export interface IGetTodoEmployeeRes {
    todos: TTodo[],
    totalPage: number
}

export interface ICreateTodoEmployeeReq {
    title: string,
    description: string,
    employeeId: string
}