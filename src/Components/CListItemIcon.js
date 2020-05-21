import { withStyles, ListItemIcon } from "@material-ui/core";

const CListItemIcon = withStyles((theme) => ({
    root: {
        minWidth: 0,
        marginRight: theme.spacing(2),
    }
}))(ListItemIcon);

export default CListItemIcon;
