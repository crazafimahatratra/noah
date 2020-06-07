import React from 'react';
import CTitle from '../Components/CTitle';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Http from '../Utils/Http';
import { makeStyles, Grid } from '@material-ui/core';
import { CalendarToday } from '@material-ui/icons';
import { OperationEditor } from '../MyDiary/MyDiary';

let http = new Http();

const styles = makeStyles((theme) => ({
    bloc: {
        borderColor: theme.palette.divider,
        borderWidth: 1,
        borderStyle: "solid",
        padding: theme.spacing(2),
        borderRadius: 5,
        transitionProperty: "box-shadow",
        transitionDuration: "300ms",
        boxShadow: "0px 0px 1px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        "&:hover": {
            boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
        },
    },
    label: {
        fontSize: 14,
        fontWeight: 700,
        color: theme.palette.primary.main,
    },
    category: {
    },
    date: {
        fontSize: 10,
        color: "#829299",
        "& svg": {
            fontSize: 12,
            marginRight: theme.spacing(1),
        }
    },
    amount: {
        fontWeight: 700,
        fontSize: 18,
        color: "#829299",
    },
}))

export default function SearchResult() {
    const [t,] = useTranslation();
    const [search, setSearch] = React.useState("");
    const params = useParams();
    const [rows, setRows] = React.useState([]);
    const [currency, setCurrency] = React.useState("fmg");
    const classes = styles();
    React.useEffect(() => {
        let pattern = localStorage.getItem("search-pattern");
        setSearch(pattern);
        http.get(`search/${btoa(pattern)}`).then(response => {
            setRows(response.data);
        }).catch(console.error);
    }, [params])

    const [values, setValues] = React.useState({});
    const [open, setOpen] = React.useState(false);
    const handleEdit = (row) => (evt) => {
        setValues({...row, date: new Date(row.date)});
        setOpen(true);
    }

    const handleChange = (name, v) => {
        if (name === "amount") {
            v = parseInt(v, 10);
        }
        if (name === "category") {
            name = "categoryId";
            v = v.id;
        }
        setValues({ ...values, [name]: v });
    };

    const handleSave = (evt) => {
        evt.preventDefault();
        let amount = currency === "fmg" ? values.amount : values.amount * 5;
        let row = { ...values, amount: amount };
        http.put(`operations/${values.id}`, row).then(response => {
            let index = rows.findIndex(r => r.id === values.id);
            rows.splice(index, 1, response.data);
            setRows([...rows]);
        })
        setOpen(false);
    };


    return (
        <>
            <CTitle subtitle={`${t("search.subtitle")} "${search}"`}>{t("search.title")}</CTitle>
            <Grid container spacing={2}>
                {rows.map(row =>
                    <Grid key={`row-${row.id}`} item xs={6} sm={4}>
                        <div className={classes.bloc} onClick={handleEdit(row)}>
                            <div className={classes.label}>
                                {row.label}
                            </div>
                            <div className={classes.category}>
                                <span style={{ width: 8, height: 8, borderRadius: 20, display: 'inline-flex', background: row.category?.color ?? '#EEEEEE', marginRight: '0.5rem' }}></span>
                                {row.category?.label}
                            </div>
                            <div className={classes.date}>
                                <CalendarToday />{new Intl.DateTimeFormat('fr').format(new Date(row.date))}
                            </div>
                            <div className={classes.amount}>
                                {new Intl.NumberFormat('fr').format(row.amount)} Fmg
                            </div>
                        </div>
                    </Grid>
                )}
            </Grid>
            <OperationEditor 
                open={open} onClose={() => setOpen(false)} onOK={handleSave}
                values={values} onValueChanged={handleChange}
                currency={currency} onCurrencyChanged={(cur) => setCurrency(cur)}
            />
        </>
    )
}
