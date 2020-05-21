import { withStyles, Button } from '@material-ui/core';

const CButton = withStyles(theme => ({
    root: {
        borderRadius: 5,
        padding: [[8, 24]],
        boxShadow: "none",
        textTransform: "none",
        fontWeight: 700,
        "& svg": {
            fontSize: 18,
            marginRight: theme.spacing(1),
        }
    },
    containedPrimary: {
        color: "white",
        "&:hover": {
            boxShadow: "none",
        }
    },
    contained: {
        "&:hover": {
            boxShadow: "none",
        }
    }
}))(Button);

export default CButton;