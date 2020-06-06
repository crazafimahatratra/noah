import React from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import { Search, ArrowRight } from '@material-ui/icons';
import CTextField from './CTextField';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

const styles = makeStyles(() => ({
    form: {
        transitionProperty: "width",
        transitionDuration: "300ms",
        width: 200,
        opacity: 1,
    },
    hide: {
        width: 0,
        opacity: 0,
    },
}))

export default function MenuSearch() {
    const classes = styles();
    const [hide, setHide] = React.useState(true);
    const [t,] = useTranslation();
    const [value, setValue] = React.useState("");
    const history = useHistory();

    /**
     * 
     * @param {Event} evt 
     */
    const handleSearch = (evt) => {
        evt.preventDefault();
        localStorage.setItem('search-pattern', value);
        history.push(`/search/${Math.ceil(Math.random() * 1000)}`);
    }
    return (
        <>
            <IconButton onClick={() => setHide(!hide)}>{hide && <Search />}{!hide && <ArrowRight />}</IconButton>
            <form onSubmit={handleSearch} className={clsx(classes.form, { [classes.hide]: hide })}>
                <CTextField value={value} onChange={(evt) => setValue(evt.target.value)} variant="outlined" size="small" fullWidth placeholder={t("common.search")}/>
            </form>
        </>
    );
}
