import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Container, Typography } from '@material-ui/core';
import CButton from '../Components/CButton';
import Logo from '../Images/Logo.svg';
import CTextField from '../Components/CTextField';
import { AccountCircle, Lock } from '@material-ui/icons'
import CCheckbox from '../Components/CCheckbox';
import Http from '../Utils/Http';
import { useHistory } from 'react-router-dom';
import Session from './Session';
import { useTranslation } from 'react-i18next';
import MenuLang from '../Components/MenuLang';
import Spinner from '../Components/Spinner';
let session = new Session();
let http = new Http();

const styles = makeStyles((theme) => ({
    bg: {
        [theme.breakpoints.up("md")]: {
            height: "100vh",
            background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            display: "flex",
            alignItems: "center",
            justifyItems: "center",
        }
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.up("md")]: {
            flexDirection: 'row',
            background: `linear-gradient(to bottom, #FFFFFF, #F2F2F2)`,
            width: 716,
            height: 414,
            margin: [[0, "auto"]],
            borderRadius: 20,
            boxShadow: "0 3px 6px rgba(0, 0, 0, 0.5)",
        },
    },
    header: {
        [theme.breakpoints.down("sm")]: {
            background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: "0 1px 12px rgba(0, 0, 0, 0.5)",
        },
        [theme.breakpoints.up("md")]: {
            [theme.breakpoints.up("md")]: {
                flex: "1 1 0"
            }
        },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: "center",
        padding: 32,
    },
    companyName: {
        color: "white",
        fontSize: 24,
        fontWeight: 700,
        [theme.breakpoints.up("md")]: {
            color: theme.palette.text.primary,
        }
    },
    companyDescription: {
        color: "white",
        fontSize: 14,
        fontWeight: 400,
        [theme.breakpoints.up("md")]: {
            color: theme.palette.text.primary,
        }
    },
    formContainer: {
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        [theme.breakpoints.up("md")]: {
            flex: "1 1 0",

        }
    },
    form: {
        marginTop: theme.spacing(3),
        display: 'flex',
        alignItems: "center",
        flexDirection: "column",
        [theme.breakpoints.down("sm")]: {
            maxWidth: 343,
            margin: [[theme.spacing(3), "auto"]],
        }
    },
    logo: {
        [theme.breakpoints.down("sm")]: {
            height: 50,
        }
    },
    mt: {
        marginTop: theme.spacing(2),
    }
}))

export default function Auth() {
    const classes = styles();
    const history = useHistory();
    const [values, setValues] = React.useState({ login: "", password: "" });
    const [errors, setErrors] = React.useState({ login: "", password: "" });
    const [loading, setLoading] = React.useState(false);
    const [t,] = useTranslation();

    /**
     * 
     * @param {Event} field 
     */
    const handleChange = (field) => (evt) => {
        setValues({ ...values, [field]: evt.target.value });
        setErrors({ ...errors, [field]: "" });
    };

    if (session.isConnected()) {
        history.replace("/");
    }

    /**
     * 
     * @param {Event} evt 
     */
    const handleSubmit = (evt) => {
        evt.preventDefault();
        let lErrors = {
            login: (values.login.length === 0 ? "Veuillez remplir le champ login" : ""),
            password: (values.password.length === 0 ? "Veuillez remplir le mot de passe" : "")
        };
        setErrors(lErrors);
        if (lErrors.password.length > 0 || lErrors.login.length > 0)
            return;
        setLoading(true);
        http.post(`auth`, { login: values.login, password: values.password }).then((response) => {
            if (response.data.accessToken) {
                session.setAccessToken(response.data.accessToken);
                history.push("/");
            }
        }).catch((reason) => {
            if (reason.response && reason.response.status === 401) {
                setErrors({ login: "auth.errors.wrong-credentials", password: "" });
            } else {
                setErrors({ login: "auth.errors.general-error", password: "" });
            }
        }).finally(() => {
            setLoading(false);
        });
    }
    return (
        <div className={classes.bg}>
            <div className={classes.root}>
                <div className={classes.header}>
                    <img src={Logo} alt="Logo" className={classes.logo} />
                    <Typography className={classes.companyName}>{t("auth.company-name")}</Typography>
                    <Typography className={classes.companyDescription}>{t("auth.company-description")}</Typography>
                </div>
                <Container className={classes.formContainer}>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Typography style={{ fontWeight: 500 }}>{t("auth.title")}</Typography>
                        <CTextField className={classes.mt} error={Boolean(errors.login)} helperText={Boolean(errors.login) ? t(errors.login) : ""} value={values.login} onChange={handleChange("login")} label={t("auth.form.email")} variant="outlined" fullWidth InputProps={{ startAdornment: <AccountCircle /> }} />
                        <CTextField className={classes.mt} error={Boolean(errors.password)} helperText={errors.password} value={values.password} onChange={handleChange("password")} label={t("auth.form.password")} variant="outlined" fullWidth type="password" InputProps={{ startAdornment: <Lock /> }} />
                        <CCheckbox className={classes.mt} label={t("auth.form.remember-me")} fullWidth />
                        <CButton className={classes.mt} disabled={values.login.length === 0 || values.password.length === 0 || loading} type="submit" fullWidth variant="contained" color="primary">
                            {t("auth.form.submit")}
                            {loading && <Spinner style={{ marginLeft: "0.5rem" }} />}
                        </CButton>
                        <MenuLang className={classes.mt} />
                    </form>
                </Container>
            </div>
        </div>
    )
}