import React, {useEffect, useRef, useState} from "react";
import Box from "@mui/material/Box";
import {socket} from "../utils/socket";
import {useAppSelector} from "../app/hooks";
import {makeStyles} from "tss-react/mui";
import {useSearchParams} from "react-router-dom";
import TodoContainerByEmployee from "../component/TodoContainerByEmployee";
import ChatWithBos from "../component/ChatWithBox";

const StyleMainPageForEmployee = makeStyles()({
    tabContainer: {
        paddingTop: "10px",
        width: "100%",
        height: "60px",
        maxWidth: "270px",
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

const MainPageForEmployee = () => {

    const {token} = useAppSelector(store => store.userSlice)

    const {classes} = StyleMainPageForEmployee();

    const tabsArray = [
        {key: "todos", name: "My todos", component: <TodoContainerByEmployee/>},
        {key: "chat", name: "Chat with bos", component: <ChatWithBos/>}
    ]

    const didMount = useRef(true);


    const [searchParams, setSearchParams] = useSearchParams();
    const [currentTab, setCurrentTab] = useState<string>(searchParams.get("currentTab") || "todos");

    const queryObject = Object.fromEntries(searchParams);

    useEffect(() => {
        if(didMount.current) {
            setSearchParams({...queryObject, currentTab}, {replace: true});
            didMount.current = false
        }

        if(searchParams.get("currentTab") && searchParams.get("currentTab") !== currentTab) {
            setCurrentTab(searchParams.get("currentTab") as string)
        }
    }, [searchParams.get("currentTab")])

    const handleChangeTab = (tabKey: string) => {
        if (tabKey !== currentTab) setSearchParams({currentTab: tabKey});
    }

    useEffect(() => {
        socket.emit("connectEmployee", token);
    }, [])

    if(didMount.current) {
        return <></>
    }

    return (
        <>
            <Box className={classes.tabContainer}>
                {tabsArray.map(({name, key}) => (
                    <button key={key} style={{border: currentTab === key ? "2px solid black" : "none"}}
                            onClick={() => handleChangeTab(key)}>{name}</button>
                ))}
            </Box>
            {tabsArray.map(({key, component}) => {
                if (currentTab === key) {
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


export default MainPageForEmployee