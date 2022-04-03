import {
    Avatar,
    Button,
    Checkbox,
    Container,
    CssBaseline,
    FormControlLabel,
    Grid,
    Link,
    makeStyles,
    TextField,
    Typography,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {
    GetUserDocument,
    GetUserQuery,
    useLoginMutation,
    useRegisterMutation,
} from "generated/graphql";
import { FormEvent, useState } from "react";
import { useHistory } from "react-router";
import "styles/main.scss";
import { setAccessToken } from "utils/getToken";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export const validate = (inputName: string, shouldValidate: Boolean) => {
    if (shouldValidate && !inputName) {
        return {
            backgroundColor: "#e0a8a8",
        };
    }

    return {};
};

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [receivePromo, setReceivePromo] = useState(false);
    const [shouldValidate, setShouldValidate] = useState(false);
    const [register] = useRegisterMutation();
    const [login] = useLoginMutation();

    const onSubmitHandler = async (e: FormEvent) => {
        e.preventDefault();
        setShouldValidate(true);

        if (!email || !password || !firstName || !lastName) return;

        const response = await register({
            variables: { email, password, firstName, lastName, receivePromo },
        });
        console.log(response, "response");

        const responseLogin = await login({
            variables: { email, password },
            update: (store, { data }) => {
                if (data) {
                    store.writeQuery<GetUserQuery>({
                        query: GetUserDocument,
                        data: {
                            getUser: data.login.user,
                        },
                    });
                }
            },
        });

        if (responseLogin.data?.login) {
            setAccessToken(responseLogin.data.login.accessToken);
        }

        history.push("/");
    };
    const classes = useStyles();
    const history = useHistory();

    return (
        <Container
            className="custom-form-wrapper"
            component="main"
            maxWidth="xs"
        >
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form
                    onSubmit={onSubmitHandler}
                    className={classes.form}
                    noValidate
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                variant="outlined"
                                required
                                onChange={(e) => setFirstName(e.target.value)}
                                value={firstName}
                                style={validate(firstName, shouldValidate)}
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                onChange={(e) => setLastName(e.target.value)}
                                value={lastName}
                                style={validate(lastName, shouldValidate)}
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                value={email}
                                style={validate(email, shouldValidate)}
                                onChange={(e) => setEmail(e.target.value)}
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                value={password}
                                style={validate(password, shouldValidate)}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value={receivePromo}
                                        name="receivePromo"
                                        color="primary"
                                        onChange={(e) => {
                                            setReceivePromo(!receivePromo);
                                        }}
                                    />
                                }
                                label="I want to receive inspiration, marketing promotions and updates via email."
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ backgroundColor: "#5d97b3" }}
                        className={classes.submit}
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link
                                onClick={() => history.push("/login")}
                                href="#"
                                variant="body2"
                            >
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};

export default Register;
