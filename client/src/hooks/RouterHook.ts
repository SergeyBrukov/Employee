import {IRouter, MayRole} from "../utils/interface";

const candidate: IRouter[] = [
    {path: "/login", element: "LoginPage", role: null},
    {path: "/register-employee/:token/:email", element: "RegisterEmployeePage", role: null},
    {path: "/register", element: "RegisterPage", role: null},
]

const user: IRouter[] = [
    {path: "/employees", element: "EmployeesPage", role: [MayRole.OWNER]},
    {path: "/create-employee", element: "CreateEmployeePage", role: [MayRole.OWNER]},
    {path: "/employee/:id", element: "EmployeeDetailPage", role: [MayRole.OWNER]},
    {path: "/employee-page", element: "MainPageForEmployee", role: [MayRole.EMPLOYEE]},
    {
        path: "/employee-todo-details-page/:id",
        element: "EmployeeTodoDetailsPage",
        role: [MayRole.OWNER, MayRole.EMPLOYEE]
    },
]

export const useRouter = (token: boolean, role: string | null) => {
    if (token) {
        return user.filter(rout => {
            if (role && rout.role?.includes(<MayRole>role)) {
                return rout
            }
        })
    } else {
        return candidate
    }
}