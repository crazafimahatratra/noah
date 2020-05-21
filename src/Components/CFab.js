import { withStyles, Fab } from "@material-ui/core";

const CFab = withStyles((theme) => ({
    root: {
        position: "fixed",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    }
}))(Fab);

export default CFab;
