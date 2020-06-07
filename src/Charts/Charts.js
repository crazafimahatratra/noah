import React from 'react';
import CTitle from '../Components/CTitle';
import { useTranslation } from 'react-i18next';
import { Grid, makeStyles, Tooltip as MuiTooltip } from '@material-ui/core';
import Http from '../Utils/Http';
import format from 'date-fns/format';
import add from 'date-fns/add';
import startOfMonth from 'date-fns/startOfMonth';
import diff from 'date-fns/differenceInDays'
import { sumByGroup } from '../Utils/Utils';

import { AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { endOfMonth } from 'date-fns';
import { TrendingUp, TrendingDown, TrendingFlat } from '@material-ui/icons';
import CRangePicker from '../Components/CRangePicker';
const http = new Http();

const dateFormat = "yyyy-MM-dd";

const fillDays = (rows, start, end) => {
    let d0 = start;
    let days = diff(end, start);
    for (var i = 0; i < days; i++) {
        let d1 = add(d0, { days: i });
        let r = rows.find(r => r.x === format(d1, dateFormat));
        if (!r) {
            rows.push({ x: format(d1, dateFormat), y: 0 });
        }
    }
};

const styles = makeStyles((theme) => ({
    toolbar: {
        display: "flex",
        alignItems: "center",
        [theme.breakpoints.down("xs")]: {
            alignItems: "flex-start",
        }
    },
    total: {
        fontSize: 32,
        fontWeight: 700,
        color: "#829299",
    },
    card: {
        borderWidth: 1, borderStyle: 'solid', borderColor: "#E0E0E0", borderRadius: 5,
        height: 200,
    }
}))

export default function Charts() {
    const [t,] = useTranslation();
    const classes = styles();
    const [data, setData] = React.useState([]);
    React.useEffect(() => {
        http.get("operations").then(response => {
            setData(response.data);
        });
    }, []);


    const [ranges, setRanges] = React.useState({
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
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
    const filterPreviousDate = (row) => {
        let end = add(ranges.startDate, { days: -1 });
        let delta = diff(ranges.startDate, ranges.endDate);
        let start = add(end, { days: delta });

        let d1 = format(start, 'yyyyMMdd');
        let d2 = format(new Date(row.date), 'yyyyMMdd');
        let d3 = format(end, 'yyyyMMdd');
        return d1 <= d2 && d2 <= d3;
    }

    const lineData = () => {
        let d = data.filter(filterDate).map(d => {
            return { x: format(new Date(d.date), dateFormat), y: d.amount ? d.amount : 0, d: d.date };
        });
        let grouped = sumByGroup(d, "x", "y");
        fillDays(grouped, ranges.startDate, ranges.endDate);
        grouped.sort((a, b) => {
            if (a.x > b.x) return 1;
            if (a.x < b.x) return -1;
            return 0;
        })
        let formatted = grouped.map(g => {
            return { x: g.x.substring(8, 10), amount: g.y };
        })
        return ([...formatted]);
    }

    const pieData = () => {
        let mapped = data.filter(filterDate).filter(d => Boolean(d.category)).map(d => {
            return {
                name: d.category.label,
                value: d.amount,
                color: d.category.color,
            }
        });
        let grouped = sumByGroup(mapped, 'name', 'value', 'color');
        grouped.sort((a, b) => {
            if (a.value < b.value) return 1;
            if (a.value > b.value) return -1;
            return 0;
        });
        return grouped;
    }

    let calculatedPieData = pieData();
    const renderActiveShape = (props) => {
        const {
            cx, cy, innerRadius, outerRadius, startAngle, endAngle,
            fill, percent,
        } = props;

        return (
            <g>
                <text x={cx} y={cy} fontWeight={500} fontSize={16} dy={8} textAnchor="middle" fill={fill}>{(percent * 100).toFixed(2)}%</text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
            </g>
        );
    };

    const [activeIndex, setActiveIndex] = React.useState(0);
    const onPieEnter = (data, index) => {
        setActiveIndex(index);
    };

    const total = calculatedPieData.reduce((a, b) => {
        return { value: a.value + b.value }
    }, { value: 0 });

    const previousTotal = data.filter(filterPreviousDate).reduce((a, b) => {
        return { amount: a.amount + b.amount }
    }, { amount: 0 });

    const delta = total.value - previousTotal.amount;
    const p = (previousTotal.amount !== 0 ? (100 * delta / previousTotal.amount) : null);

    return (
        <>
            <div className={classes.toolbar}>
                <CTitle subtitle={t("charts.subtitle")}>{t("charts.title")}</CTitle>
                <CRangePicker style={{ marginLeft: "1rem" }} ranges={ranges} onChange={handleRangeChanged} />
            </div>

            <Grid container spacing={1}>
                <Grid item xs={12} md={4}>
                    <div className={classes.card} style={{ padding: "1rem" }}>
                        <h1 className={classes.total}>
                            {new Intl.NumberFormat('fr').format(total.value)} Fmg
                            <MuiTooltip title={`${new Intl.NumberFormat('fr').format(previousTotal.amount)} Fmg`}>
                                <span style={{ marginLeft: "1rem" }}>
                                    {total.value > previousTotal.amount && <TrendingUp style={{ color: "#FC7255" }} />}
                                    {total.value < previousTotal.amount && <TrendingDown style={{ color: "#8DD06A" }} />}
                                    {total.value === previousTotal.amount && <TrendingFlat />}
                                </span>
                            </MuiTooltip>
                        </h1>
                        <div style={{ color: "#505050", fontSize: 12 }}>
                            {p === null && <span>Je n'ai aucune idée de ce que <strong>{total.value} Fmg</strong> représente. Du coup, je sais pas si c'est cool ou pas :/</span>}
                            {p > 0 && <span><strong style={{ color: "#FC7255" }}>Attention !</strong><br />Augmentation de <strong>{p.toFixed(2)} %</strong> par rapport à la période précédente</span>}
                            {p < 0 && <span><strong style={{ color: "#8DD06A" }}>Cool !!!</strong><br />Diminution de <strong>{-p.toFixed(2)} %</strong> par rapport à la période précédente</span>}
                            {p === 0 && <span>C'est plutôt stable :)</span>}
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} md={8}>
                    <div className={classes.card}>
                        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row" }}>
                            <div style={{ flex: "1 1 0" }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            activeShape={renderActiveShape}
                                            activeIndex={activeIndex}
                                            onMouseEnter={onPieEnter}
                                            data={calculatedPieData} dataKey="value" innerRadius={"60%"} paddingAngle={3}>
                                            {calculatedPieData.map((d, i) => <Cell key={`cell-${i}`} fill={d.color} />)}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ display: "flex", flex: "1 1 0", alignItems: "center" }}>
                                <ul>
                                    {calculatedPieData.map((d, i) =>
                                        <li key={`li-${i}`} style={{ color: d.color }}>
                                            {d.name}
                                            <strong style={{ marginLeft: "1rem", fontSize: 14, fontWeight: 700 }}>({d.value})</strong>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.card} style={{ height: 250, paddingTop: "2rem" }}>
                        <ResponsiveContainer>
                            <AreaChart
                                data={lineData()}
                                margin={{
                                    top: 5, right: 30, left: 20, bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="1 5" />
                                <XAxis dataKey="x" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="amount" stroke="#FC7255" strokeWidth={2} fill="#FC7255" fillOpacity={0.5} activeDot={{ r: 5 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Grid>
            </Grid>

        </>
    );
}
