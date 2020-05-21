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
            main: "#ec407a",
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
        color: theme.palette.primary.dark,
        cursor: "pointer",
        fontWeight: 700,
    },
    danger: {
        color: theme.palette.error.main,
    },
}));

export default function useCommonStyles() {
    return (commonStyles());
};
