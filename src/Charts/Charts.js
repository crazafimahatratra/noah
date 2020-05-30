import React from 'react';
import CTitle from '../Components/CTitle';
import { useTranslation } from 'react-i18next';
import { Grid } from '@material-ui/core';
import Http from '../Utils/Http';
import format from 'date-fns/format';
import add from 'date-fns/add';
import startOfMonth from 'date-fns/startOfMonth';
import getDaysInMonth from 'date-fns/getDaysInMonth';
import { sumByGroup } from '../Utils/Utils';

import { AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
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

    const [data, setData] = React.useState([]);
    React.useEffect(() => {
        http.get("operations").then(response => {
            setData(response.data);
        });
    }, []);

    const lineData = () => {
        let d = data.map(d => {
            return { x: format(new Date(d.date), dateFormat), y: d.amount ? d.amount : 0, d: d.date };
        });
        let grouped = sumByGroup(d, "x", "y");
        fillDays(grouped);
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
        let mapped = data.filter(d => Boolean(d.category)).map(d => {
            return {
                name: d.category.label,
                value: d.amount,
                color: d.category.color,
            }
        });
        let grouped = sumByGroup(mapped, 'name', 'value', 'color');
        return grouped;
    }

    let calculatedPieData = pieData();
    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const {
            cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
            fill, payload, percent, value,
        } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

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

    return (
        <>
            <CTitle subtitle={t("charts.subtitle")}>{t("charts.title")}</CTitle>
            <Grid container>
                <Grid item xs={12} md={6} style={{ height: 300 }}>
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
                            <Area type="monotone" dataKey="amount" stroke="#FC7255" strokeWidth={2} fill="#FC7255" fillOpacity={1} activeDot={{ r: 5 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                    <div style={{ height: 300, width: "100%", display: "flex", flexDirection: "row" }}>
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
                                        <strong style={{ marginLeft: "1rem", fontSize: 16, fontWeight: 700 }}>({d.value})</strong>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </Grid>
            </Grid>

        </>
    );
}
