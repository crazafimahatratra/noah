import React from 'react';
import { useTranslation } from 'react-i18next';
import CTitle from '../Components/CTitle';
import { Table, TableHead, TableRow, TableBody, TableFooter, TableCell, IconButton, makeStyles, ButtonGroup } from '@material-ui/core';
import { CTableCellHeader, CTableRow } from '../Components/CTable';
import { Check, Cancel, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import CTextField from '../Components/CTextField';
import useCommonStyles from '../Theme';
import CButton from '../Components/CButton';

const styles = makeStyles((theme) => ({
    toolbar: {
        display: "flex",
        alignItems: "center",
    },
    total: {
        fontSize: 32,
        fontWeight: 700,
        color: "#829299",
    },
}))

export default function MyDiary() {
    const classes = styles();
    const commonClasses = useCommonStyles();
    const [t,] = useTranslation();
    const [loading, setLoading] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const [values, setValues] = React.useState({
        date: new Date(), label: "", amount: 0,
    });

    const handleChange = (name) => (evt) => {
        let v = evt.target.value;
        if (name === "amount") {
            v = parseInt(v, 10);
            if(isNaN(v)) v = 0;
        }
        setValues({ ...values, [name]: v });
    };
    const handleCancel = () => {
        setValues({ ...values, label: "", amount: 0 });
    };
    const handleSubmit = (evt) => {
        evt.preventDefault();
        rows.push(values);
        setRows([...rows]);
        handleCancel();
    };

    const sum = rows.reduce((a, b) => { return { amount: a.amount + b.amount } }, { amount: 0 });
    return (
        <>
            <div className={classes.toolbar}>
                <CTitle subtitle={t("my-diary.subtitle")}>{t("my-diary.title")}</CTitle>
                <div style={{ flexGrow: 1 }}></div>
                <h1 className={classes.total}>{new Intl.NumberFormat('fr').format(sum.amount)} Fmg.</h1>
                <div style={{ flexGrow: 1 }}></div>
                <ButtonGroup>
                    <CButton variant="outlined" style={{ paddingRight: 2, paddingLeft: 2 }}><KeyboardArrowLeft/></CButton>
                    <CButton variant="outlined" color="primary">01/01/2020</CButton>
                    <CButton variant="outlined" style={{ paddingRight: 2, paddingLeft: 2 }}><KeyboardArrowRight/></CButton>
                </ButtonGroup>
            </div>
            {!loading &&
                <Table>
                    <TableHead>
                        <TableRow>
                            <CTableCellHeader style={{ width: 50 }}>#</CTableCellHeader>
                            <CTableCellHeader>{t("my-diary.table.date")}</CTableCellHeader>
                            <CTableCellHeader>{t("my-diary.table.label")}</CTableCellHeader>
                            <CTableCellHeader>{t("my-diary.table.amount")}</CTableCellHeader>
                            <CTableCellHeader></CTableCellHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, i) =>
                            <CTableRow key={`row-${i}`}>
                                <TableCell></TableCell>
                                <TableCell>{new Intl.DateTimeFormat('fr').format(row.date)}</TableCell>
                                <TableCell>{row.label}</TableCell>
                                <TableCell align="right">{new Intl.NumberFormat('fr').format(row.amount)}</TableCell>
                                <TableCell>
                                    <IconButton title={t('common.delete')} size="small" className="hoverIcon"><Cancel className={commonClasses.danger} /></IconButton>
                                </TableCell>
                            </CTableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>
                            </TableCell>
                            <TableCell>
                                <form onSubmit={handleSubmit}>
                                    <CTextField onChange={handleChange("label")} value={values.label} fullWidth variant="outlined" size="small" />
                                </form>
                            </TableCell>
                            <TableCell>
                                <form onSubmit={handleSubmit}>
                                    <CTextField onChange={handleChange("amount")} value={values.amount} fullWidth variant="outlined" size="small" type="number" />
                                </form>
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={handleSubmit} size="small" color="primary"><Check /></IconButton>
                                <IconButton onClick={handleCancel} size="small"><Cancel /></IconButton>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>}
        </>
    );
}