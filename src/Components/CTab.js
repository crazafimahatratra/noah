import { withStyles, Tab } from "@material-ui/core";

const CTab = withStyles((theme) => ({
    wrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        textTransform: "none",
        color: theme.palette.primary.dark,
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column",
            alignItems: "center",
        },
        "& svg": {
            marginRight: theme.spacing(1),
            [theme.breakpoints.down("xs")]: {
                marginRight: 0,
            }
        },
    },
    labelIcon: {
        maxWidth: "none",
        minHeight: 47,
        flex: "1 1 0",
    }
}))(Tab);
export default CTab;
