import React from 'react';
import CTitle from '../Components/CTitle';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export default function SearchResult() {
    const [t,] = useTranslation();
    const [search, setSearch] = React.useState("");
    const params = useParams();
    React.useEffect(() => {
        setSearch(localStorage.getItem("search-pattern"))
    }, [params])
    return (
        <>
            <CTitle subtitle={`${t("search.subtitle")} "${search}"`}>{t("search.title")}</CTitle>
        </>
    )
}
