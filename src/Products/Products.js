import React from 'react';
import CTitle from '../Components/CTitle';
import { useTranslation, Trans } from 'react-i18next';
import Http from '../Utils/Http';
import Loader from '../Components/Loader';
import { Table, TableHead, TableRow, TableBody, TableCell, IconButton } from '@material-ui/core';
import { CTableCellHeader, CTableRow } from '../Components/CTable';
import { Cancel, Edit } from '@material-ui/icons';
import useCommonStyles from '../Theme';
import CDialog from '../Components/CDialog';
import { Alert } from '@material-ui/lab';
const http = new Http();

export default function Products() {
    const [t,] = useTranslation();
    const [loading, setLoading] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const commonClasses = useCommonStyles();

    React.useEffect(() => {
        setLoading(false);
        http.get('products').then(response => { setRows(response.data) })
            .finally(() => setLoading(false));
    }, []);

    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [currentRow, setCurrentRow] = React.useState(null);
    const [loadingSubmit, setLoadingSubmit] = React.useState(false);
    const handleDelete = (row) => () => {
        setCurrentRow(row);
        setOpenConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (!currentRow) return;
        http.delete(`products/${currentRow.id}`).then(() => {
            setOpenConfirm(false);
            let index = rows.findIndex(r => r.id === currentRow.id);
            if (index >= 0) {
                rows.splice(index, 1);
                setRows([...rows]);
            }
        }).finally(() => {
            setLoadingSubmit(false);
        });
    };

    return (
        <>
            <CTitle subtitle={t("my-products.subtitle")}>{t("my-products.title")}</CTitle>
            {loading && <Loader />}
            {!loading &&
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <CTableCellHeader>{t("my-products.table.label")}</CTableCellHeader>
                            <CTableCellHeader>{t("my-products.table.unit")}</CTableCellHeader>
                            <CTableCellHeader align="right">{t("my-products.table.pu")}</CTableCellHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) =>
                            <CTableRow key={`row-${row.id}`}>
                                <TableCell className={commonClasses.tdPrimary}>
                                    <span style={{ marginRight: "1rem" }}>{row.label}</span>
                                    <IconButton onClick={handleDelete(row)} title={t('common.edit')} size="small" className="hoverIcon"><Edit /></IconButton>
                                    <IconButton onClick={handleDelete(row)} title={t('common.delete')} size="small" className="hoverIcon"><Cancel className={commonClasses.danger} /></IconButton>
                                </TableCell>
                                <TableCell align="right">{row.unit}</TableCell>
                                <TableCell align="right">{new Intl.NumberFormat('fr').format(row.pu)}</TableCell>
                            </CTableRow>
                        )}
                    </TableBody>
                </Table>
            }

            <CDialog open={openConfirm}
                title={t("common.confirm-delete")} onOK={handleConfirmDelete} onClose={() => setOpenConfirm(false)}
                okLabel={t("common.delete")} okIcon={<Cancel />} variant="danger" loading={loadingSubmit}
            >
                <Alert severity="warning">
                    <Trans i18nKey="my-products.confirm-delete" t={t}>
                        xxx <strong>{{ name: currentRow ? currentRow.label : "xxx" }}</strong> ?
                    </Trans>
                </Alert>
            </CDialog>
        </>
    );
}