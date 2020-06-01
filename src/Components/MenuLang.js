import React from 'react';
import { Popover, MenuItem, Divider, IconButton } from '@material-ui/core';
import { Language, KeyboardArrowDown } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import CButton from './CButton';

const languages = [{value: "en-US", label: "EN"}, {value: "fr-FR", label: "FR"}]

/**
 * 
 * @param {{className: string}} props 
 */
export default function MenuLang(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [width, setWidth] = React.useState(0);
    const [,i18n] = useTranslation();
    /**
     * 
     * @param {Event} evt 
     */
    const handleClick = (evt) => {
        setAnchorEl(evt.currentTarget);
        setWidth(evt.currentTarget.clientWidth);
    }

    const handleMenuClick = (lang) => (_evt) => {
        i18n.changeLanguage(lang);
        setAnchorEl(null);
    };

    const langLabel = (lang) => {
        let l = languages.find(i => i.value === lang);
        if(l) return l.label;
        return "";
    }
    return (
        <>
            <CButton className={props.className} onClick={handleClick}>
                <Language/> {langLabel(i18n.language)}
                <KeyboardArrowDown />
            </CButton>
            <Popover 
            open={Boolean(anchorEl)} 
            onClose={() => {setAnchorEl(null)}} anchorEl={anchorEl} PaperProps={{style: {width: width}}}
            anchorOrigin={{horizontal: "left", vertical: "bottom"}}
            >
                <MenuItem disabled>{langLabel(i18n.language)}</MenuItem>
                <Divider/>
                {languages.map((l, i) => <MenuItem onClick={handleMenuClick(l.value)} button key={`lang-${i}`}>{l.label}</MenuItem>)}
            </Popover>
        </>
    );
}