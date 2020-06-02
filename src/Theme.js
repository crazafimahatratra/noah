import { createMuiTheme, makeStyles } from '@material-ui/core/styles';

export const colors = ["#f44336", "#e91e63", "#ba68c8", "#9575cd", "#7986cb", "#2196f3", "#03a9f4", "#00bcd4"
    , "#009688", "#4caf50", "#558b2f", "#827717", "#ef6c00", "#a1887f", "#757575", "#78909c"
];

export const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#f44336",
        },
        secondary: {
            main: "#00bcd4",
        },
        text: {
            primary: "#202020",
        },
        background: {
            default: "white",
        }
    },
    typography: {
        fontSize: 13,
    },
});

const commonStyles = makeStyles((theme) => ({
    tdPrimary: {
        color: theme.palette.secondary.dark,
        cursor: "pointer",
        fontWeight: 700,
    },
    danger: {
        color: theme.palette.error.main,
    },
    mt1: {
        marginTop: theme.spacing(1),
    },
    menuButton: {
        color: theme.palette.grey[800],
        textTransform: "none",
        "& svg:nth-child(1)": {
            color: theme.palette.grey[700],
            marginRight: theme.spacing(1),
        },
    },
}));

export default function useCommonStyles() {
    return (commonStyles());
};
