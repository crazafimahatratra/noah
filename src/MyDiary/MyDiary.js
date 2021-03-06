import React from 'react';
import { useTranslation } from 'react-i18next';
import CTitle from '../Components/CTitle';
import { Table, TableHead, TableRow, TableBody, TableCell, IconButton, makeStyles, Popover, useTheme, useMediaQuery, InputAdornment, Grid } from '@material-ui/core';
import { Autocomplete, createFilterOptions, Alert } from '@material-ui/lab'
import { CTableCellHeader, CTableRow } from '../Components/CTable';
import { Cancel, Add, Edit } from '@material-ui/icons';
import CTextField from '../Components/CTextField';
import CButton from '../Components/CButton';
import Http from '../Utils/Http';
import Loader from '../Components/Loader';
import CDialog from '../Components/CDialog';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import format from 'date-fns/format';
import CFab from '../Components/CFab';
import MenuCurrency from '../Components/MenuCurrency';
import useCommonStyles from '../Theme';
import CRangePicker from '../Components/CRangePicker';

let http = new Http();

const styles = makeStyles((theme) => ({
    toolbar: {
        display: "flex",
        alignItems: "center",
        [theme.breakpoints.down("xs")]: {
            alignItems: "flex-start",
        }
    },
    total: {
        fontWeight: 700,
        color: "#829299",
    },
}));

/**
 * @typedef CategoryPickerProperties
 * @type {object}
 * @property {object} value
 * @property {function} onSelect
 * 
 * @param {CategoryPickerProperties} props 
 */
function CategoryPicker(props) {
    const [t,] = useTranslation();
    const [categories, setCategories] = React.useState([]);
    const filter = createFilterOptions();

    React.useEffect(() => {
        let r1 = http.get('categories');
        Promise.all([r1])
            .then(([response1]) => {
                setCategories(response1.data);
            })
            .catch(console.error)
    }, []);

    const createCategory = (label) => {
        let p = { label: label, color: "" };
        categories.push(p);
        setCategories([...categories]);
        if (props.onSelect) props.onSelect(p);
    };

    const handleSelect = (_evt, value) => {
        if (!value) return;
        if (value.inputValue) {
            createCategory(value.inputValue, value.color);
            return;
        }
        if (typeof value === "string") {
            createCategory(value, 0);
            return;
        }
        if (props.onSelect) props.onSelect(value);
    }

    return (<Autocomplete options={categories} clearOnBlur freeSolo
        value={props.value}
        getOptionLabel={(option) => {
            if (typeof option === "string") return option;
            return option.label;
        }}
        renderInput={(params) => <CTextField {...params} label={t("my-diary.table.category")} variant="outlined" size="small" fullWidth />}
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
    />)
}

/**
 * @typedef OperationEditorProperties
 * @type {object}
 * @property {boolean} open
 * @property {function} onClose
 * @property {function} onOK
 * @property {{category: object, date: Date, label: string, amount: number}} values
 * @property {function} onValueChanged
 * @property {"fmg"|"ar"} currency
 * @property {function} onCurrencyChanged
 * 
 * @param {OperationEditorProperties} props 
 */
export function OperationEditor(props) {
    const [t,] = useTranslation();
    const commonClasses = useCommonStyles();
    const [anchorDate, setAnchorDate] = React.useState(null);
    const handleCurrencyChanged = (evt) => {
        if (props.onCurrencyChanged) props.onCurrencyChanged(evt.target.value);
    }
    const handleCategorySelected = (c) => {
        if (props.onValueChanged) props.onValueChanged("category", c);
    }
    const handleChange = (name) => (evt) => {
        if (props.onValueChanged) props.onValueChanged(name, evt.target.value);
    }
    const handleDateChanged = (name, date) => {
        if (props.onValueChanged) props.onValueChanged(name, date);
    }

    return (
        <>
            <CDialog open={props.open} onClose={props.onClose} onOK={props.onOK} title={props.values?.id ? t("my-diary.edit") : t("common.new-entry")}>
                <CategoryPicker value={props.values?.category} onSelect={handleCategorySelected} />
                <CTextField className={commonClasses.mt1} fullWidth variant="outlined" size="small" onClick={(evt) => setAnchorDate(evt.currentTarget)} value={format(props.values?.date ?? new Date(), "dd/MM/yyyy")} />
                <CTextField className={commonClasses.mt1} label={t("my-diary.table.label")} onChange={handleChange("label")} value={props.values?.label} fullWidth variant="outlined" size="small" />
                <Grid container spacing={1} className={commonClasses.mt1} >
                    <Grid item xs={12} sm={8}>
                        <CTextField label={t("my-diary.table.amount")} onChange={handleChange("amount")} value={isNaN(props.values?.amount) ? "" : props.values?.amount.toString()} fullWidth variant="outlined" size="small"
                            InputProps={{
                                endAdornment: <InputAdornment><MenuCurrency value={props.currency} onChange={handleCurrencyChanged} /></InputAdornment>,
                                classes: { adornedEnd: commonClasses.nopadding }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <CTextField label={props.currency === "ar" ? "En Fmg" : "En Ariary"} value={props.currency === "ar" ? props.values?.amount * 5 : props.values?.amount / 5} fullWidth variant="outlined" disabled size="small" />
                    </Grid>
                </Grid>
                <Popover PaperProps={{ style: { height: 400 } }} anchorOrigin={{ horizontal: "left", vertical: "bottom" }} anchorEl={anchorDate} open={Boolean(anchorDate)} onClose={() => setAnchorDate(null)}>
                    <Calendar date={props.values?.date} onChange={item => { handleDateChanged("date", item); setAnchorDate(null); }} />
                </Popover>
            </CDialog>
        </>)
}

export function MyDiary() {
    const classes = styles();
    const commonClasses = useCommonStyles();
    const [t,] = useTranslation();
    const [loading, setLoading] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const [currency, setCurrency] = React.useState("fmg");

    React.useEffect(() => {
        setLoading(true);
        let r2 = http.get('operations');
        Promise.all([r2])
            .then(([response2]) => {
                setRows(response2.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);
    const [values, setValues] = React.useState({
        date: new Date(), category: { label: "", color: "" }, amount: 0, label: ""
    });

    const handleChange = (name, v) => {
        if (name === "amount") {
            v = parseInt(v, 10);
        }
        setValues({ ...values, [name]: v });
    };
    const handleCancel = () => {
        setValues({ ...values, category: { label: "", color: 0 }, amount: 0, label: "", id: 0 });
    };

    const createOperation = (categoryId) => {
        let amount = currency === "fmg" ? values.amount : values.amount * 5;
        let row = { date: values.date, categoryId: categoryId, amount: amount, label: values.label };
        if (values.id) {
            http.put(`operations/${values.id}`, row).then(response => {
                let index = rows.findIndex(r => r.id === values.id);
                rows.splice(index, 1, response.data);
                setRows([...rows]);
            })
        } else {
            http.post('operations', row)
                .then(response => {
                    rows.push(response.data);
                    setRows([...rows]);
                })
                .catch(console.error);
        }
    }

    const [openEdit, setOpenEdit] = React.useState(false);
    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (values.amount === 0) return;
        if (!values.category.id) {
            http.post('categories', values.category)
                .then(response => {
                    createOperation(response.data.id);
                })
                .catch(console.error);
        } else {
            createOperation(values.category.id);
        }

        handleCancel();
        setOpenEdit(false);
    };

    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [currentRow, setCurrentRow] = React.useState(null);
    const [loadingSubmit, setLoadingSubmit] = React.useState(false);
    const handleDelete = (row) => () => {
        setCurrentRow(row);
        setOpenConfirm(true);
    }
    const handleEdit = (row) => () => {
        if (row)
            setValues({ ...values, date: new Date(row.date), category: row.category, amount: row.amount, label: row.label, id: row.id })
        else
            handleCancel();
        setOpenEdit(true);
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

    const filterDate = (row) => {
        let d1 = format(ranges.startDate, 'yyyyMMdd');
        let d2 = format(new Date(row.date), 'yyyyMMdd');
        let d3 = format(ranges.endDate, 'yyyyMMdd');
        return d1 <= d2 && d2 <= d3;
    }
    const sum = rows.filter(filterDate).reduce((a, b) => { return { amount: a.amount + b.amount } }, { amount: 0 });

    const [anchorDate, setAnchorDate] = React.useState(null);

    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.down("xs"));

    return (
        <>
            <div className={classes.toolbar}>
                <CTitle subtitle={t("my-diary.subtitle")}>{t("my-diary.title")}</CTitle>
                <div style={{ flexGrow: 1 }}></div>
                {!xs && <CButton onClick={handleEdit(null)} color="primary" style={{ marginRight: "1rem" }} variant="outlined"><Add /> {t("common.new-entry")}</CButton>}
                <CRangePicker ranges={ranges} onChange={handleRangeChanged} />
                {!xs && <><div style={{ flexGrow: 1 }}></div><h1 className={classes.total}>{new Intl.NumberFormat('fr').format(sum.amount)} Fmg</h1></>}
            </div>

            {xs && <><h1 className={classes.total}>{new Intl.NumberFormat('fr').format(sum.amount)} Fmg</h1></>}

            <Popover PaperProps={{ style: { height: 400 } }} anchorOrigin={{ horizontal: "left", vertical: "bottom" }} anchorEl={anchorDate} open={Boolean(anchorDate)} onClose={() => setAnchorDate(null)}>
                <Calendar date={values.date} onChange={item => { setValues({ ...values, date: item }); setAnchorDate(null); }} />
            </Popover>

            {loading && <Loader />}
            {!loading &&
                <Table>
                    <TableHead>
                        <TableRow>
                            {!xs && <><CTableCellHeader style={{ width: 100 }}>{t("my-diary.table.date")}</CTableCellHeader>
                                <CTableCellHeader>{t("my-diary.table.category")}</CTableCellHeader>
                                <CTableCellHeader>{t("my-diary.table.label")}</CTableCellHeader>
                                <CTableCellHeader align="right" style={{ width: 150 }}>{t("my-diary.table.amount")}</CTableCellHeader>
                                <CTableCellHeader></CTableCellHeader></>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.filter(filterDate).map((row, i) =>
                            <CTableRow key={`row-${i}`}>
                                {!xs && <><TableCell>{new Intl.DateTimeFormat('fr').format(new Date(row.date))}</TableCell>
                                    <TableCell className={commonClasses.tdPrimary}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ width: 16, height: 16, borderRadius: 20, display: 'inline-flex', background: row.category ? row.category.color : '#EEEEEE', marginRight: '1rem' }}></span>
                                            {row.category ? row.category.label : ""}
                                        </div>
                                    </TableCell>
                                    <TableCell className={commonClasses.tdPrimary}>{row.label}</TableCell>
                                    <TableCell align="right">{new Intl.NumberFormat('fr').format(row.amount)}</TableCell></>}
                                {xs &&
                                    <>
                                        <TableCell>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{ width: 8, height: 8, borderRadius: 20, display: 'inline-flex', background: row.category ? row.category.color : '#EEEEEE', marginRight: '1rem' }}></span>
                                                {row.category ? row.category.label : ""}
                                            </div>
                                            {new Intl.DateTimeFormat('fr').format(new Date(row.date))}&nbsp;-&nbsp;
                                        {row.label}
                                        </TableCell>
                                        <TableCell align="right" style={{ paddingRight: 0, paddingLeft: 0 }}>
                                            <span style={{ fontSize: 20, fontWeight: 700, marginLeft: "2rem" }}>{new Intl.NumberFormat('fr').format(row.amount)} Fmg</span>
                                        </TableCell>
                                    </>
                                }
                                <TableCell>
                                    <IconButton onClick={handleDelete(row)} title={t('common.delete')} size="small" className="hoverIcon"><Cancel className={commonClasses.danger} /></IconButton>
                                    <IconButton onClick={handleEdit(row)} title={t('common.delete')} size="small" className="hoverIcon"><Edit /></IconButton>
                                </TableCell>
                            </CTableRow>
                        )}
                    </TableBody>
                </Table>
            }

            <CDialog open={openConfirm}
                title={t("common.confirm-delete")} onOK={handleConfirmDelete} onClose={() => setOpenConfirm(false)}
                okLabel={t("common.delete")} okIcon={<Cancel />} variant="danger" loading={loadingSubmit}
            >
                <Alert severity="warning">
                    {t("my-diary.confirm-delete")}
                </Alert>
            </CDialog>

            <OperationEditor
                open={openEdit} onClose={() => setOpenEdit(false)} onOK={handleSubmit}
                values={values} onValueChanged={handleChange}
                currency={currency} onCurrencyChanged={(cur) => setCurrency(cur)}
            />
            {xs && <CFab color="primary" onClick={handleEdit(null)}><Add /></CFab>}
        </>
    );
}