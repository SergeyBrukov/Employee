export type TEmployees = {
    id: string,
    firstName: string,
    email: string
    lastName: string,
    age: string,
    address: string
    status: string
    role: string
}

export type TTodo = {
    id: string,
    title: string,
    description: string,
    complete: boolean
    employeeId:string
}

export type TCreateTodo = {
    title: string,
    description: string
}

export type TFile = {
    id: string,
    name: string,
    type: string,
    base64: string
}

export type TMessage = {
    id: string
    authorName: string
    messageValue: string
    messageFiles: TFile[]
    date: Date
    replaceMessageId?: string | null

}