import React, {FC, lazy, Suspense} from "react";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface ISuspenseWrapper {
    path: string
}


const SuspenseWrapper: FC<ISuspenseWrapper> = ({path}) => {

    const LazyComponent = lazy(() => import(`../pages/${path}`))

    return (
        <Suspense fallback={
            <Backdrop sx={{ color: '#fff' }} open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>
        }>
            <LazyComponent/>
        </Suspense>
    )
}


export default SuspenseWrapper