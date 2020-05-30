import React from 'react';
import CTitle from '../Components/CTitle';
import { useTranslation } from 'react-i18next';
import { Grid } from '@material-ui/core';
import Http from '../Utils/Http';
import format from 'date-fns/format';
import add from 'date-fns/add';
import startOfMonth from 'date-fns/startOfMonth';
import getDaysInMonth from 'date-fns/getDaysInMonth';
import { Chart } from 'react-charts';
import { sumByGroup } from '../Utils/Utils';
const http = new Http();

const dateFormat = "yyyy-MM-dd";

const fillDays = (rows) => {
    let d0 = startOfMonth(new Date());
    let days = getDaysInMonth(new Date());
    for (var i = 0; i < days; i++) {
        let d1 = add(d0, { days: i });
        let r = rows.find(r => r.x === format(d1, dateFormat));
        if (!r) {
            rows.push({ x: format(d1, dateFormat), y: 0 });
        }
    }
};

export default function Charts() {
    const [t,] = useTranslation();

    const [data, setData] = React.useState([[]]);
    React.useEffect(() => {
        http.get("operations").then(response => {
            let d = response.data.map(d => {
                return {x: format(new Date(d.date), dateFormat), y: d.amount ? d.amount : 0, d: d.date};
            });
            let grouped = sumByGroup(d, "x", "y");
            fillDays(grouped);
            grouped.sort((a, b) => {
                if(a.x > b.x) return 1;
                if(a.x < b.x) return -1;
                return 0;
            })
            let formatted = grouped.map(g => {
                return {x: g.x.substring(8, 10), y: g.y};
            })
            setData([[...formatted]]);
        });
    }, []);

    const axes = React.useMemo(() => [
        { primary: true, type: 'ordinal', position: 'bottom', show: true },
        { position: 'left', type: 'linear', show: true }
    ], []);

    return (
        <>
            <CTitle subtitle={t("charts.subtitle")}>{t("charts.title")}</CTitle>
            <Grid container spacing={1}>
                <Grid item xs={12} style={{height: 300}}>
                    <Chart data={data} axes={axes} tooltip />
                </Grid>
            </Grid>

        </>
    );
}
