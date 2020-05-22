import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, makeStyles } from '@material-ui/core';
import CButton from './CButton';
import { useTranslation } from 'react-i18next';
import { Save, Close } from '@material-ui/icons';
import Spinner from './Spinner';
import clsx from 'clsx';

const styles = makeStyles((theme) => ({
    paper: {
        width: 600,
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
        flexGrow: 1,
    },
    closeIcon: {
        display: "flex",
        justifyContent: "flex-end",
        "& svg": {
            color: theme.palette.grey[500],
            fontSize: 14,
            cursor: "pointer",
            marginRight: 0,
            "&:hover": {
                color: theme.palette.grey[800]
            },
        },
    },
    dialogTitle: {
    },
    dialogContent: {
        paddingTop: 24,
        paddingBottom: 48,
    },
    dialogActions: {
        borderTopColor: theme.palette.grey[300],
        borderTopWidth: 1,
        borderTopStyle: "solid",
        paddingTop: 12,
        paddingBottom: 12,
    },
    buttonDefault: {
        color: "white",
        background: theme.palette.primary.main,
        "&:hover": {
            background: theme.palette.primary.dark,
        }
    },
    buttonDanger: {
        background: theme.palette.error.main,
        "&:hover": {
            background: theme.palette.error.dark,
        }
    },
}));

/**
 * @typedef CDialogClasses
 * @type {object}
 * @property {string} paper Paper className
 * 
 * @typedef CDialogParameters
 * @type {object}
 * @property {boolean} open set to `true` to open the dialog
 * @property {() => {}} onClose
 * @property {() => {}} onOK called when OK button was clicked
 * @property {string} title Dialog title
 * @property {boolean} loading set to `true` if an action is still loading
 * @property {string} okLabel the OK button label
 * @property {React.ReactElement} okIcon the OK button icon
 * @property {"default" | "danger"} variant the OK button color
 * @property {CDialogClasses} classes Dialog classes
 * @param {CDialogParameters} props
 */
export default function CDialog(props) {
    const [t,] = useTranslation();
    const classes = styles();
    const variant = props.variant || "default";
    const propsClasses = props.classes;
    return (
        <Dialog open={props.open} onClose={props.onClose} classes={{paper: clsx(classes.paper, propsClasses ? propsClasses.paper : "")}}>
            <DialogTitle className={classes.dialogTitle} disableTypography>
                <div className={classes.closeIcon}><Close onClick={props.onClose}/></div>
                <div className={classes.title}>{props.title}</div>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                {props.children}
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
                <CButton disabled={props.loading} onClick={props.onOK} className={clsx(classes.buttonDefault, {[classes.buttonDanger]: variant === "danger"})} variant="contained" style={{ marginRight: "0.5rem" }}>
                    {props.okIcon ||  <Save />} {props.okLabel || t("common.save")}
                    {props.loading && <Spinner style={{ marginLeft: "0.5rem" }} />}
                </CButton>
                <CButton disabled={props.loading} onClick={props.onClose} variant="outlined">{t("common.cancel")}</CButton>
            </DialogActions>
        </Dialog>
    );
}
