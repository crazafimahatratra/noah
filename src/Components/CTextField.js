import { TextField, withStyles } from '@material-ui/core';

const CTextField = withStyles((theme) => ({
    root: {
        "& svg": {
            color: theme.palette.grey[500],
            marginRight: theme.spacing(1),
            fontSize: 18,
        },
        "& fieldset": {
            borderColor: "#A7BBC4",
        },
        "& .MuiOutlinedInput-root:hover fieldset": {
            borderColor: "#A7BBC483",
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1,
        },
        "& .MuiFormHelperText-contained": {
            marginLeft: 0,
        }
    },
}))(TextField);

export default CTextField;