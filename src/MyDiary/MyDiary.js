import React from 'react';
import { useTranslation } from 'react-i18next';
import CTitle from '../Components/CTitle';
import { Table, TableHead, TableRow, TableBody, TableCell, IconButton, makeStyles, Popover, Hidden, TableFooter, useTheme, useMediaQuery } from '@material-ui/core';
import { Autocomplete, createFilterOptions, Alert } from '@material-ui/lab'
import { CTableCellHeader, CTableRow } from '../Components/CTable';
import { Check, Cancel, KeyboardArrowDown, CalendarToday } from '@material-ui/icons';
import CTextField from '../Components/CTextField';
import useCommonStyles from '../Theme';
import CButton from '../Components/CButton';
import Http from '../Utils/Http';
import Loader from '../Components/Loader';
import CDialog from '../Components/CDialog';
import { DateRangePicker, Calendar } from 'react-date-range';
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
        fontWeight: 700,
        color: "#829299",
        margin: 0,
    },
}))

export default function MyDiary() {
    const classes = styles();
    const commonClasses = useCommonStyles();
    const [t,] = useTranslation();
    const [loading, setLoading] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const filter = createFilterOptions();

    const [categories, setCategories] = React.useState([]);
    React.useEffect(() => {
        setLoading(true);
        let r1 = http.get('categories');
        let r2 = http.get('operations');
        Promise.all([r1, r2])
            .then(([response1, response2]) => {
                setCategories(response1.data);
                setRows(response2.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);
    const [values, setValues] = React.useState({
        date: new Date(), category: { label: "", color: "" }, amount: 0, label: ""
    });

    const handleChange = (name) => (evt) => {
        let v = evt.target.value;
        if (name === "amount") {
            v = parseInt(v, 10);
            if (isNaN(v)) v = 0;
        }
        setValues({ ...values, [name]: v });
    };
    const handleCancel = () => {
        setValues({ ...values, category: { label: "", color: 0 }, amount: 0, label: "" });
    };

    const createOperation = (categoryId, amount) => {
        http.post('operations', { date: values.date, categoryId: categoryId, amount: amount, label: values.label })
            .then(response => {
                rows.push(response.data);
                setRows([...rows]);
            })
            .catch(console.error);
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (values.amount === 0) return;
        if (!values.category.id) {
            http.post('categories', values.category)
                .then(response => {
                    createOperation(response.data.id, values.amount);
                })
                .catch(console.error);
        } else {
            createOperation(values.category.id, values.amount);
        }
        handleCancel();
    };

    const createCategory = (label, color) => {
        let p = { label: label, color: "" };
        categories.push(p);
        setCategories([...categories]);
        setValues({ ...values, category: p });
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
        setValues({ ...values, category: value });
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
                <CButton variant="text" onClick={handleOpenCalendar}>
                    {!xs && <>{new Intl.DateTimeFormat('fr').format(ranges.startDate)} - {new Intl.DateTimeFormat('fr').format(ranges.endDate)}<KeyboardArrowDown /></>}
                    {xs && <><CalendarToday /></>}
                </CButton>
                {!xs && <><div style={{ flexGrow: 1 }}></div><h1 className={classes.total}>{new Intl.NumberFormat('fr').format(sum.amount)} Fmg</h1></>}
            </div>

            {xs && <><h1 className={classes.total}>{new Intl.NumberFormat('fr').format(sum.amount)} Fmg</h1></>}

            <Popover PaperProps={{ style: { height: 400 } }} anchorOrigin={{ horizontal: "left", vertical: "bottom" }} anchorEl={anchorCalendar} open={Boolean(anchorCalendar)} onClose={() => setAnchorCalendar(null)}>
                <DateRangePicker ranges={[ranges]} onChange={handleRangeChanged} />
            </Popover>
            <Popover PaperProps={{ style: { height: 400 } }} anchorOrigin={{ horizontal: "left", vertical: "bottom" }} anchorEl={anchorDate} open={Boolean(anchorDate)} onClose={() => setAnchorDate(null)}>
                <Calendar date={values.date} onChange={item => { setValues({ ...values, date: item }) }} />
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
                                <TableCell>{new Intl.DateTimeFormat('fr').format(new Date(row.date))}</TableCell>
                                <TableCell className={commonClasses.tdPrimary}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ width: 16, height: 16, display: 'inline-flex', background: row.category ? row.category.color : '#EEEEEE', marginRight: '1rem' }}></span>
                                        {row.category ? row.category.label : ""}
                                    </div>
                                </TableCell>
                                {!xs && <TableCell className={commonClasses.tdPrimary}>{row.label}</TableCell>}
                                <TableCell align="right">{new Intl.NumberFormat('fr').format(row.amount)}</TableCell>
                                <TableCell>
                                    <IconButton onClick={handleDelete(row)} title={t('common.delete')} size="small" className="hoverIcon"><Cancel className={commonClasses.danger} /></IconButton>
                                </TableCell>
                            </CTableRow>
                        )}
                    </TableBody>
                    {!xs && <TableFooter>
                        <TableRow>
                            <TableCell>
                                <CButton onClick={(evt) => setAnchorDate(evt.currentTarget)}>{format(values.date, "dd/MM/yyyy")}</CButton>
                            </TableCell>
                            <TableCell>
                                <Autocomplete options={categories} clearOnBlur freeSolo
                                    value={values.category}
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
                            </TableCell>
                        </TableRow>
                    </TableFooter>}
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
        </>
    );
}