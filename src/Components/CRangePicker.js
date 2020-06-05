import React from 'react';
import { Popover } from '@material-ui/core';
import { DateRangePicker } from 'react-date-range';
import { KeyboardArrowDown } from '@material-ui/icons';
import CButton from './CButton';

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
        if(props.onChange) props.onChange(r);
    };
    return (
        <>
            <CButton variant="text" onClick={handleOpenCalendar} style={{ marginLeft: "1rem" }}>
                <>{new Intl.DateTimeFormat('fr').format(props.ranges?.startDate)} - {new Intl.DateTimeFormat('fr').format(props.ranges?.endDate)}<KeyboardArrowDown /></>
            </CButton>
            <Popover PaperProps={{ style: { height: 400 } }} anchorOrigin={{ horizontal: "left", vertical: "bottom" }} anchorEl={anchorCalendar} open={Boolean(anchorCalendar)} onClose={() => setAnchorCalendar(null)}>
                <DateRangePicker ranges={[props.ranges]} onChange={handleRangeChanged} />
            </Popover>
        </>
    )
}