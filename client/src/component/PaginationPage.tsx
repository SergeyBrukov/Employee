import * as React from 'react';
import {FC} from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {makeStyles} from "tss-react/mui";

interface IPaginationPage {
    count: number,
    currentPage: string,
    handleChange: (page: number) => void
}

const stylePaginationPage = makeStyles()({
    paginationPageContainer: {
        padding: "15px 0",
        alignItems: "end",
        ".MuiPaginationItem-page": {
            color: "#FFFFFF"
        },
        ".Mui-selected": {
            backgroundColor: "#FFFFFF",
            color: "#0E0E0B"
        }
    }
})

const PaginationPage: FC<IPaginationPage> = ({currentPage, count, handleChange}) => {

    const {classes} = stylePaginationPage();

    return (
        <Stack spacing={2} className={classes.paginationPageContainer}>
            <Pagination
                count={count || 1}
                onChange={(event, page) => handleChange(page)}
                page={Number(currentPage) || 1}
                renderItem={(item) => (
                    <PaginationItem
                        slots={{previous: ArrowBackIcon, next: ArrowForwardIcon}}
                        {...item}
                    />
                )}
            />
        </Stack>
    );
}

export default PaginationPage