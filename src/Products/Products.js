import React from 'react';
import CTitle from '../Components/CTitle';
import { useTranslation } from 'react-i18next';
import Http from '../Utils/Http';
import Loader from '../Components/Loader';
import { Table, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core';
import { CTableCellHeader, CTableRow } from '../Components/CTable';
const http = new Http();

export default function Products() {
    const [t,] = useTranslation();
    const [loading, setLoading] = React.useState(false);
    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {
        setLoading(false);
        http.get('products').then(response => { setRows(response.data) })
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <CTitle subtitle={t("my-products.subtitle")}>{t("my-products.title")}</CTitle>
            {loading && <Loader />}
            {!loading &&
                <Table>
                    <TableHead>
                        <TableRow>
                            <CTableCellHeader>{t("my-products.table.label")}</CTableCellHeader>
                            <CTableCellHeader>{t("my-products.table.pu")}</CTableCellHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) =>
                            <CTableRow key={`row-${row.id}`}>
                                <TableCell>{row.label}</TableCell>
                                <TableCell>{row.pu}</TableCell>
                            </CTableRow>
                        )}
                    </TableBody>
                </Table>
            }
        </>
    );
}