import React from 'react';
import CTitle from '../Components/CTitle';
import { useTranslation, Trans } from 'react-i18next';
import Http from '../Utils/Http';
import Loader from '../Components/Loader';
import { Table, TableHead, TableRow, TableBody, TableCell, IconButton } from '@material-ui/core';
import { CTableCellHeader, CTableRow } from '../Components/CTable';
import { Cancel, Edit } from '@material-ui/icons';
import CDialog from '../Components/CDialog';
import { Alert } from '@material-ui/lab';
import CTextField from '../Components/CTextField';
import useCommonStyles from '../Theme';
const http = new Http();

export default function Categories() {
    const [t,] = useTranslation();
    const [loading, setLoading] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const commonClasses = useCommonStyles();

    React.useEffect(() => {
        setLoading(false);
        http.get('categories').then(response => { setRows(response.data) })
            .finally(() => setLoading(false));
    }, []);

    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [currentRow, setCurrentRow] = React.useState({ label: "", color: "" });
    const [loadingSubmit, setLoadingSubmit] = React.useState(false);
    const handleDelete = (row) => () => {
        setCurrentRow(row);
        setOpenConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (!currentRow) return;
        http.delete(`categories/${currentRow.id}`).then(() => {
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

    const [openEdit, setOpenEdit] = React.useState(false);
    const handleEdit = (row) => () => {
        setCurrentRow(row);
        setOpenEdit(true);
    }

    const handleSave = (evt) => {
        evt.preventDefault();
        setLoadingSubmit(true);
        http.put(`categories/${currentRow.id}`, currentRow)
            .then(() => {
                let index = rows.findIndex(r => r.id === currentRow.id);
                if (index >= 0) {
                    rows.splice(index, 1, currentRow);
                    setRows([...rows]);
                }
                setOpenEdit(false);
            })
            .catch(console.error)
            .finally(() => {
                setLoadingSubmit(false);
            })
    }

    const handleChange = (name) => (evt) => {
        setCurrentRow({ ...currentRow, [name]: evt.target.value });
    }

    return (
        <>
            <CTitle subtitle={t("my-categories.subtitle")}>{t("my-categories.title")}</CTitle>
            {loading && <Loader />}
            {!loading &&
                <Table>
                    <TableHead>
                        <TableRow>
                            <CTableCellHeader>{t("my-categories.table.label")}</CTableCellHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) =>
                            <CTableRow key={`row-${row.id}`}>
                                <TableCell className={commonClasses.tdPrimary}>
                                    <span style={{ width: 16, height: 16, display: 'inline-flex', background: row.color ? row.color : '#EEEEEE', marginRight: '1rem' }}></span>
                                    <span style={{ marginRight: "1rem" }}>{row.label}</span>
                                    <IconButton onClick={handleEdit(row)} title={t('common.edit')} size="small" className="hoverIcon"><Edit /></IconButton>
                                    <IconButton onClick={handleDelete(row)} title={t('common.delete')} size="small" className="hoverIcon"><Cancel className={commonClasses.danger} /></IconButton>
                                </TableCell>
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
                    <Trans i18nKey="my-categories.confirm-delete" t={t}>
                        xxx <strong>{{ name: currentRow ? currentRow.label : "xxx" }}</strong> ?
                    </Trans>
                </Alert>
            </CDialog>

            <CDialog open={openEdit} title={t("my-categories.dialog.edit")} onOK={handleSave} onClose={() => setOpenEdit(false)} loading={loadingSubmit}>
                <form onSubmit={handleSave}>
                    <CTextField className={commonClasses.mt1} fullWidth label={t("my-categories.table.color")} variant="outlined" value={currentRow.color} onChange={handleChange("color")} />
                    <CTextField className={commonClasses.mt1} fullWidth label={t("my-categories.table.label")} variant="outlined" value={currentRow.label} onChange={handleChange("label")} />
                </form>
            </CDialog>
        </>
    );
}