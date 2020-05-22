import React from 'react';
import { useTranslation } from 'react-i18next';
import CTitle from '../Components/CTitle';
import { Table, TableHead, TableRow, TableBody, TableCell, IconButton, makeStyles, ButtonGroup } from '@material-ui/core';
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
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
    const [loading,] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const filter = createFilterOptions();

    const [products, setProducts] = React.useState([]);
    const [values, setValues] = React.useState({
        date: new Date(), product: { label: "", pu: 0 }, qty: 1, pu: 0,
    });

    const handleChange = (name) => (evt) => {
        let v = evt.target.value;
        if (name === "pu" || name === "qty") {
            v = parseInt(v, 10);
            if (isNaN(v)) v = 0;
        }
        setValues({ ...values, [name]: v });
    };
    const handleCancel = () => {
        setValues({ ...values, product: { label: "", pu: 0 }, qty: 1, pu: 0 });
    };
    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (values.pu * values.qty === 0) return;
        rows.push(values);
        setRows([...rows]);
        handleCancel();
    };
    const handleSelect = (_evt, value) => {
        if (!value) return;
        if (value.inputValue) {
            setValues({ ...values, product: { ...value, label: value.inputValue } });
            products.push({ label: value.inputValue, pu: value.pu });
            setProducts([...products]);
            return;
        }
        setValues({ ...values, product: value, pu: value.pu });
    }
    console.log(products);

    const sum = rows.reduce((a, b) => { return { amount: a.amount + b.qty * b.pu } }, { amount: 0 });
    return (
        <>
            <div className={classes.toolbar}>
                <CTitle subtitle={t("my-diary.subtitle")}>{t("my-diary.title")}</CTitle>
                <div style={{ flexGrow: 1 }}></div>
                <h1 className={classes.total}>{new Intl.NumberFormat('fr').format(sum.amount)} Fmg.</h1>
                <div style={{ flexGrow: 1 }}></div>
                <ButtonGroup>
                    <CButton variant="outlined" style={{ paddingRight: 2, paddingLeft: 2 }}><KeyboardArrowLeft /></CButton>
                    <CButton variant="outlined" color="primary">01/01/2020</CButton>
                    <CButton variant="outlined" style={{ paddingRight: 2, paddingLeft: 2 }}><KeyboardArrowRight /></CButton>
                </ButtonGroup>
            </div>
            {!loading &&
                <Table>
                    <TableHead>
                        <TableRow>
                            <CTableCellHeader style={{ width: 100 }}>{t("my-diary.table.date")}</CTableCellHeader>
                            <CTableCellHeader>{t("my-diary.table.label")}</CTableCellHeader>
                            <CTableCellHeader align="right" style={{ width: 150 }}>{t("my-diary.table.pu")}</CTableCellHeader>
                            <CTableCellHeader align="right" style={{ width: 150 }}>{t("my-diary.table.qte")}</CTableCellHeader>
                            <CTableCellHeader align="right" style={{ width: 150 }}>{t("my-diary.table.amount")}</CTableCellHeader>
                            <CTableCellHeader></CTableCellHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, i) =>
                            <CTableRow key={`row-${i}`}>
                                <TableCell>{new Intl.DateTimeFormat('fr').format(row.date)}</TableCell>
                                <TableCell>{row.product ? row.product.label : ""}</TableCell>
                                <TableCell align="right">{new Intl.NumberFormat('fr').format(row.pu)}</TableCell>
                                <TableCell align="right">{new Intl.NumberFormat('fr').format(row.qty)}</TableCell>
                                <TableCell align="right">{new Intl.NumberFormat('fr').format(row.qty * row.pu)}</TableCell>
                                <TableCell>
                                    <IconButton title={t('common.delete')} size="small" className="hoverIcon"><Cancel className={commonClasses.danger} /></IconButton>
                                </TableCell>
                            </CTableRow>
                        )}
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>
                                <Autocomplete options={products} clearOnBlur freeSolo
                                    value={values.product}
                                    getOptionLabel={(option) => {
                                        if (typeof option === "string") return option;
                                        return option.label;
                                    }}
                                    renderInput={(params) => <CTextField {...params} variant="outlined" size="small" fullWidth />}
                                    onChange={handleSelect}
                                    filterOptions={(options, params) => {
                                        const filtered = filter(options, params);
                                        // Suggest the creation of a new value
                                        if (params.inputValue !== '') {
                                            filtered.push({
                                                inputValue: params.inputValue,
                                                label: `Add "${params.inputValue}"`,
                                                pu: 0
                                            });
                                        }

                                        return filtered;
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <form onSubmit={handleSubmit}>
                                    <CTextField onChange={handleChange("pu")} value={values.pu} fullWidth variant="outlined" size="small" type="number" />
                                </form>
                            </TableCell>
                            <TableCell>
                                <form onSubmit={handleSubmit}>
                                    <CTextField onChange={handleChange("qty")} value={values.qty} fullWidth variant="outlined" size="small" type="number" />
                                </form>
                            </TableCell>
                            <TableCell align="right">
                                {new Intl.NumberFormat('fr').format(values.qty * values.pu)}
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={handleSubmit} size="small" color="primary"><Check /></IconButton>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>}
        </>
    );
}