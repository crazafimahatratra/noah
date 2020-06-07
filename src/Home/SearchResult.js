import React from 'react';
import CTitle from '../Components/CTitle';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Http from '../Utils/Http';

let http = new Http();

export default function SearchResult() {
    const [t,] = useTranslation();
    const [search, setSearch] = React.useState("");
    const params = useParams();
    const [rows, setRows] = React.useState([]);
    React.useEffect(() => {
        let pattern = localStorage.getItem("search-pattern");
        setSearch(pattern);
        http.get(`search/${btoa(pattern)}`).then(response => {

        }).catch(console.error);
    }, [params])


    return (
        <>
            <CTitle subtitle={`${t("search.subtitle")} "${search}"`}>{t("search.title")}</CTitle>
        </>
    )
}
