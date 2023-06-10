import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import {useRouter} from "../hooks/RouterHook";
import Layout from "../Layout/Layout";
import PageNotFound from "../pages/PageNotFound";
import SuspenseWrapper from "./SuspenseWrapper";
import {useAppSelector} from "../app/hooks";
import {MayRole} from "../utils/interface";


const Router = () => {

    const {token, role} = useAppSelector(store => store.userSlice)

    const routers = useRouter(!!token, role);

    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                {role === MayRole.OWNER && <Route path="/" element={<Navigate to="/employees"/>}/>}
                {role === MayRole.EMPLOYEE && <Route path="/" element={<Navigate to="/employee-page"/>}/>}
                <Route path="/" element={!token && <Navigate to="/login"/>}/>
                {routers.map(({path, element}) => {
                    return (
                        <Route key={element} path={path} element={<SuspenseWrapper path={element}/>}/>
                    )
                })}
            </Route>
            <Route path="*" element={<SuspenseWrapper path="PageNotFound"/>}/>
        </Routes>
    )
}

export default Router;