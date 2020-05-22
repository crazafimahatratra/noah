import React from 'react';
import { useTranslation } from 'react-i18next';
import CTitle from '../Components/CTitle';
import { Table, TableHead, TableRow, TableBody, TableCell, IconButton, makeStyles, ButtonGroup, Popover } from '@material-ui/core';
import { Autocomplete, createFilterOptions, Alert } from '@material-ui/lab'
import { CTableCellHeader, CTableRow } from '../Components/CTable';
import { Check, Cancel, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import CTextField from '../Components/CTextField';
import useCommonStyles from '../Theme';
import CButton from '../Components/CButton';
import Http from '../Utils/Http';
import Loader from '../Components/Loader';
import CDialog from '../Components/CDialog';
import {DateRangePicker, Calendar} from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import format from 'date-fns/format';

let http = new Http();

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
    const filter = createFilterOptions();

    const [products, setProducts] = React.useState([]);
    React.useEffect(() => {
        setLoading(true);
        let r1 = http.get('products');
        let r2 = http.get('operations');
        Promise.all([r1, r2])
            .then(([response1, response2]) => {
                setProducts(response1.data);
                setRows(response2.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);
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

    const createOperation = (productId, pu, qty) => {
        http.post('operations', { date: values.date, productId: productId, pu: pu, qty: qty })
            .then(response => {
                rows.push(response.data);
                setRows([...rows]);
            })
            .catch(console.error);
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (values.pu * values.qty === 0) return;
        if (!values.product.id) {
            values.product.pu = values.pu;
            http.post('products', values.product)
                .then(response => {
                    createOperation(response.data.id, values.pu, values.qty);
                })
                .catch(console.error);
        } else {
            createOperation(values.product.id, values.pu, values.qty);
        }
        handleCancel();
    };

    const createProduct = (label, pu) => {
        let p = { label: label, pu: pu, unit: "" };
        products.push(p);
        setProducts([...products]);
        setValues({ ...values, product: p });
    };

    const handleSelect = (_evt, value) => {
        if (!value) return;
        if (value.inputValue) {
            createProduct(value.inputValue, value.pu);
            return;
        }
        if (typeof value === "string") {
            createProduct(value, 0);
            return;
        }
        setValues({ ...values, product: value, pu: value.pu });
    }

    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [currentRow, setCurrentRow] = React.useState(null);
    const [loadingSubmit, setLoadingSubmit] = React.useState(false);
    const handleDelete = (row) => () => {
        setCurrentRow(row);
        setOpenConfirm(true);
    }
    const handleConfirmDelete = () => {
        if (!currentRow) return;
        setLoadingSubmit(true);
        http.delete(`operations/${currentRow.id}`)
            .then(() => {
                let index = rows.findIndex(r => r.id === currentRow.id);
                if (index >= 0) {
                    rows.splice(index, 1);
                    setRows([...rows]);
                }
            })
            .finally(() => {
                setOpenConfirm(false);
                setLoadingSubmit(false);
            })
    }

    const [anchorCalendar, setAnchorCalendar] = React.useState(null);
    const handleOpenCalendar = (evt) => {
        setAnchorCalendar(evt.currentTarget);
    };
    const [ranges, setRanges] = React.useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    })

    const handleRangeChanged = (r) => {
        if (r.selection) {
            setRanges({ ...ranges, startDate: r.selection.startDate, endDate: r.selection.endDate });
        }
    };

    const sum = rows.reduce((a, b) => { return { amount: a.amount + b.qty * b.pu } }, { amount: 0 });
    const filterDate = (row) => {
        let d1 = format(ranges.startDate, 'yyyyMMdd');
        let d2 = format(new Date(row.date), 'yyyyMMdd');
        let d3 = format(ranges.endDate, 'yyyyMMdd');
        return d1 <= d2 && d2 <= d3;
    }

    const [anchorDate, setAnchorDate] = React.useState(null);
    return (
        <>
            <div className={classes.toolbar}>
                <CTitle subtitle={t("my-diary.subtitle")}>{t("my-diary.title")}</CTitle>
                <div style={{ flexGrow: 1 }}></div>
                <CButton variant="outlined" onClick={handleOpenCalendar}>{new Intl.DateTimeFormat('fr').format(ranges.startDate)} - {new Intl.DateTimeFormat('fr').format(ranges.endDate)}</CButton>
                <div style={{ flexGrow: 1 }}></div>
                <h1 className={classes.total}>{new Intl.NumberFormat('fr').format(sum.amount)} Fmg.</h1>
            </div>

            <Popover PaperProps={{style: {height: 400}}} anchorOrigin={{horizontal: "left", vertical: "bottom"}} anchorEl={anchorCalendar} open={Boolean(anchorCalendar)} onClose={() => setAnchorCalendar(null)}>
                <DateRangePicker ranges={[ranges]} onChange={handleRangeChanged}/>
            </Popover>
            <Popover PaperProps={{style: {height: 400}}} anchorOrigin={{horizontal: "left", vertical: "bottom"}} anchorEl={anchorDate} open={Boolean(anchorDate)} onClose={() => setAnchorDate(null)}>
                <Calendar date={values.date} onChange={item => {setValues({...values, date: item})}}/>
            </Popover>
            

            {loading && <Loader />}
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
                        {rows.filter(filterDate).map((row, i) =>
                            <CTableRow key={`row-${i}`}>
                                <TableCell>{new Intl.DateTimeFormat('fr').format(new Date(row.date))}</TableCell>
                                <TableCell>{row.product ? row.product.label : ""}</TableCell>
                                <TableCell align="right">{new Intl.NumberFormat('fr').format(row.pu)}</TableCell>
                                <TableCell align="right">{new Intl.NumberFormat('fr').format(row.qty)}</TableCell>
                                <TableCell align="right">{new Intl.NumberFormat('fr').format(row.qty * row.pu)}</TableCell>
                                <TableCell>
                                    <IconButton onClick={handleDelete(row)} title={t('common.delete')} size="small" className="hoverIcon"><Cancel className={commonClasses.danger} /></IconButton>
                                </TableCell>
                            </CTableRow>
                        )}
                        <TableRow>
                            <TableCell>
                                <CButton onClick={(evt) => setAnchorDate(evt.currentTarget)}>{format(values.date, "dd/MM/yyyy")}</CButton>
                            </TableCell>
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

            <CDialog open={openConfirm}
                title={t("common.confirm-delete")} onOK={handleConfirmDelete} onClose={() => setOpenConfirm(false)}
                okLabel={t("common.delete")} okIcon={<Cancel />} variant="danger" loading={loadingSubmit}
            >
                <Alert severity="warning">
                    {t("my-diary.confirm-delete")}
                </Alert>
            </CDialog>
        </>
    );
}