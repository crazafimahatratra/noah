import React from 'react';
import { Popover } from '@material-ui/core';
import { DateRangePicker } from 'react-date-range';
import { KeyboardArrowDown, CalendarToday } from '@material-ui/icons';
import CButton from './CButton';
import dateAdd from 'date-fns/add';
import dateFormat from 'date-fns/format';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';

const format = 'dd/MM/yyyy';
const d0 = new Date(); // today
const d1 = dateAdd(d0, { days: -1 }) // yesterday
const w0 = startOfWeek(d0);
const w1 = endOfWeek(d0);
const w00 = dateAdd(w0, {days: -7});
const w01 = dateAdd(w1, {days: -7});
let m0 = startOfMonth(d0);
let m1 = endOfMonth(d0);
let m00 = dateAdd(m0, {months: -1})
let m01 = endOfMonth(m00);
const dateLabels = [
    { value: `${dateFormat(d0, format)} - ${dateFormat(d0, format)}`, label: "Aujourd'hui" },
    { value: `${dateFormat(d1, format)} - ${dateFormat(d1, format)}`, label: "Hier" },
    { value: `${dateFormat(w0, format)} - ${dateFormat(w1, format)}`, label: "Cette semaine" },
    { value: `${dateFormat(w00, format)} - ${dateFormat(w01, format)}`, label: "Semaine dernière" },
    { value: `${dateFormat(m0, format)} - ${dateFormat(m1, format)}`, label: "Mois en cours" },
    { value: `${dateFormat(m00, format)} - ${dateFormat(m01, format)}`, label: "Mois dernier" },
];

const humanize = (date1, date2) => {
    let v1 = dateFormat(date1, format);
    let v2 = dateFormat(date2, format)
    let value = `${v1} - ${v2}`;
    let label = dateLabels.find(d => d.value === value);
    return label?.label ?? (v1 === v2 ? v1 : value);
}

/**
 * @typedef CRangePickerProperties
 * @type {object}
 * @property {{startDate: Date, endDate: Date}} ranges
 * @property {function} onChange
 * 
 * @param {CRangePickerProperties} props 
 */
export default function CRangePicker(props) {
    const [anchorCalendar, setAnchorCalendar] = React.useState(null);
    const handleOpenCalendar = (evt) => {
        setAnchorCalendar(evt.currentTarget);
    };

    const handleRangeChanged = (r) => {
        if (props.onChange) props.onChange(r);
    };

    return (
        <>
            <CButton variant="outlined" onClick={handleOpenCalendar} style={{ marginLeft: "1rem" }}>
                <CalendarToday/>
                {humanize(props.ranges?.startDate, props.ranges?.endDate)}<KeyboardArrowDown style={{marginRight: 0}} />
            </CButton>
            <Popover PaperProps={{ style: { height: 400 } }} anchorOrigin={{ horizontal: "left", vertical: "bottom" }} anchorEl={anchorCalendar} open={Boolean(anchorCalendar)} onClose={() => setAnchorCalendar(null)}>
                <DateRangePicker ranges={[props.ranges ?? {}]} onChange={handleRangeChanged} />
            </Popover>
        </>
    )
}