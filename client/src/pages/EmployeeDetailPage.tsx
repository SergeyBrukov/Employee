import React, {useEffect, useRef, useState} from 'react'
import {useLocation, useSearchParams} from "react-router-dom";
import Box from "@mui/material/Box";
import {makeStyles} from "tss-react/mui";
import EmployeeDetailContainer from "../component/EmployeeDetailContainer";
import EmployeeTodoContainer from "../component/EmployeeTodoContainer";
import queryString from "query-string";
import ChatWithBos from "../component/ChatWithBox";

const StyleEmployeeDetailPage = makeStyles()({
    tabContainer: {
        paddingTop: "10px",
        width: "100%",
        height: "60px",
        maxWidth: "450px",
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        background: "#0E0E0B",
        borderRadius: "12px",
        "button": {
            width: "125px",
            maxHeight: "40px",
            cursor: "pointer"
        }
    }
})

const EmployeeDetailPage = () => {

    const {classes} = StyleEmployeeDetailPage();

    const {search} = useLocation();

    const queryStringParams = queryString.parse(search)

    const [searchParams, setSearchParams] = useSearchParams();

    const didMount = useRef(true);

    const [currentTab, setCurrentTab] = useState(searchParams.get("currentTab"));


    useEffect(() => {
        if (didMount.current && !searchParams.has("currentTab")) {
            didMount.current = false;
            setSearchParams({currentTab: "detailsEmployee"}, {replace: true})
            return
        }

        if (searchParams.has("currentTab") && searchParams.get("currentTab") !== currentTab) {
            setCurrentTab(searchParams.get("currentTab") as string);
        }

    }, [queryStringParams.currentTab])


    const handleChangeTab = (key: string) => {

        if (key !== currentTab) {
            setSearchParams({currentTab: key});
            setCurrentTab(key);
        }

    }

    const tabsArray = [
        {
            key: "detailsEmployee",
            name: "Details employee",
            component: <EmployeeDetailContainer tabKey="detailsEmployee"/>
        },
        {key: "employeeTodo", name: "Employee todo", component: <EmployeeTodoContainer/>},
        {key: "chat", name: "Chat with bos", component: <ChatWithBos/>}
    ]


    return (
        <>
            <Box className={classes.tabContainer}>
                {tabsArray.map(({name, key}) => (
                    <button key={key} style={{border: currentTab === key ? "2px solid black" : "none"}}
                            onClick={() => handleChangeTab(key)}>{name}</button>
                ))}
            </Box>

            {tabsArray.map(({key, component}) => {
                if (key === currentTab) {
                    return (
                        <React.Fragment key={key}>
                            {component}
                        </React.Fragment>
                    )
                }
            })}

        </>
    )
}

export default EmployeeDetailPage