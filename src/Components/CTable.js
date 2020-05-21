import { withStyles, TableContainer, TableCell, TableRow } from "@material-ui/core";

export const CTableContainer = withStyles((theme) => ({
    root: {
        background: "white",
        padding: `${theme.spacing(2)}px ${theme.spacing(5)}px`,
    },
}))(TableContainer);

export const CTableCellHeader = withStyles((theme) => ({
    root: {
        textTransform: 'uppercase',
        fontWeight: 400,
        fontSize: 12,
        color: theme.palette.grey[700],
        borderTopWidth: 1,
        borderTopStyle: "solid",
        borderTopColor: theme.palette.grey[300],
        padding: theme.spacing(2),
    },
}))(TableCell);

export const CTableRow = withStyles((theme) => ({
    root: {
        transitionProperty: "background",
        transitionDuration: "300ms",
        "& .hoverIcon": {
            opacity: 0,
            color: "#202020",
            "& svg": {
                fontSize: 14,
            }
        },
        "&:hover": {
            background: theme.palette.grey[100],
            "& .hoverIcon": {
                opacity: 1,
            },
        },
    },
}))(TableRow);