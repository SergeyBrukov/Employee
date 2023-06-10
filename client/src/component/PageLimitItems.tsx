import React, {FC} from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {makeStyles} from "tss-react/mui";
import {useSearchParams} from "react-router-dom";


const stylePageLimitItems = makeStyles()({
    pageItemsLimitSelect: {
        "div": {
            padding: "6px 14px"
        },
        '.MuiOutlinedInput-notchedOutline': {
            borderColor: "#0E0E0B",
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: "1px solid #0E0E0B"
        },
    },
    pageItemsLimitSelectLabel: {
        paddingBottom: "5px",
        color: "#FFFFFF"
    }
})

interface IPageLimitItems {
    pageItems: string,
    handleChange: (event: SelectChangeEvent) => void,
}

const PageLimitItems: FC<IPageLimitItems> = ({pageItems, handleChange}) => {

    const {classes} = stylePageLimitItems();

    return (
        <Box sx={{maxWidth: 120}}>
            <InputLabel className={classes.pageItemsLimitSelectLabel}>Page items</InputLabel>
            <FormControl fullWidth>
                <Select
                    className={classes.pageItemsLimitSelect}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={pageItems}
                    onChange={handleChange}
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}

export default PageLimitItems;