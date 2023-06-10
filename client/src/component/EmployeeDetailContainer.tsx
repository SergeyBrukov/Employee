import React, {ChangeEvent, useEffect, useRef, useState} from 'react'
import {URLSearchParamsInit, useLocation, useParams, useSearchParams} from "react-router-dom";
import Box from "@mui/material/Box";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {employeeDetail} from "../features/employeeDetailSlice";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {makeStyles} from "tss-react/mui";
import EmployeeDetailInfo from "../component/EmployeeDetailInfo";
import EmployeeDetailChangeInfo from "../component/EmployeeDetailChangeInfo";
import queryString from "query-string";


interface IEmployeeDetailContainer {
    tabKey: string,
}

const StyleEmployeeDetailPage = makeStyles()({
    employeeDetailPageContainer: {
        margin: "50px auto 0",
        padding: "50px 25px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "15px",
        background: "#0E0E0B",
        borderRadius: "12px"
    },
    employeeDetailPageTypeBlock: {
        width: "100%",
        display: "flex",
        gap: "15px"
    },
    employeeDetailPageTypeShowLabel: {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        cursor: "pointer",
        color: "#FFFFFF",
        "&.input[type: radio]": {
            width: "15px"
        }
    }
})

const EmployeeDetailContainer = ({tabKey}: IEmployeeDetailContainer) => {

    const {classes} = StyleEmployeeDetailPage();

    const {search} = useLocation();
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryStringParams = queryString.parse(search)


    const dispatch = useAppDispatch();
    const {loading, employeeDetailsInfo} = useAppSelector(store => store.employeeDetailSlice)


    const [typeShowInfo, setTypeShowInfo] = useState<string>(searchParams.get("type") || "showInfo")

    const didMount = useRef(true);

    useEffect(() => {
        dispatch(employeeDetail({employeeId: params.id as string}))
    }, [])


    const changeTypeShowInfo = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchParams({currentTab: tabKey, type: e.target.value});
        setTypeShowInfo(e.target.value);
    }

    useEffect(() => {
        if (searchParams.get("currentTab") === tabKey && didMount.current && !searchParams.get("type")) {
            didMount.current = false
            setSearchParams({currentTab: tabKey, type: typeShowInfo}, {replace: true});
            return;
        }

        if (searchParams.get("currentTab") === tabKey && searchParams.get("type") !== typeShowInfo) {
            setTypeShowInfo(searchParams.get("type") as string)
        }

    }, [queryStringParams.type])

    if (loading || !employeeDetailsInfo) {
        return (
            <Backdrop sx={{color: '#fff'}} open={true}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        )
    }

    return (
        <Box className={classes.employeeDetailPageContainer}>
            <Box className={classes.employeeDetailPageTypeBlock}>
                <label className={classes.employeeDetailPageTypeShowLabel}>Show info
                    <input type="radio" name="typeShow" value="showInfo"
                           checked={typeShowInfo === "showInfo" && true}
                           onChange={changeTypeShowInfo}/>
                </label>

                <label className={classes.employeeDetailPageTypeShowLabel}>
                    Change info
                    <input type="radio" name="typeShow" value="changeInfo"
                           checked={typeShowInfo === "changeInfo" && true}
                           onChange={changeTypeShowInfo}/>
                </label>

            </Box>
            {typeShowInfo === "showInfo" ? <EmployeeDetailInfo employeeDetailsInfo={employeeDetailsInfo}/> :
                <EmployeeDetailChangeInfo employeeDetailsInfo={employeeDetailsInfo}/>
            }
        </Box>
    )
}

export default React.memo(EmployeeDetailContainer)