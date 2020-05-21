import { withStyles, Tooltip } from "@material-ui/core";

const CTooltip = withStyles(() => ({
    tooltip: {
        fontSize: 12
    }
}))(Tooltip);

export default CTooltip;
