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
} from "generated/graphql";
import React, { FormEvent, useState } from "react";
import { RouteComponentProps } from "react-router";
import { setAccessToken } from "utils/getToken";
import "styles/main.scss";
import { validate } from "pages/Register";

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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const Login: React.FC<RouteComponentProps> = ({ history }) => {
    const classes = useStyles();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [shouldValidate, setShouldValidate] = useState(false);

    const [login] = useLoginMutation();

    const onSubmitHandler = async (e: FormEvent) => {
        e.preventDefault();
        setShouldValidate(true);

        if (!email || !password) return;

        const response = await login({
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

        if (response.data?.login) {
            setAccessToken(response.data.login.accessToken);
        }

        history.push("/");
    };

    return (
        <Container
            component="main"
            className={"custom-form-wrapper"}
            maxWidth="xs"
        >
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form
                    onSubmit={onSubmitHandler}
                    className={classes.form}
                    noValidate
                >
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        value={email}
                        style={validate(email, shouldValidate)}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
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
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ backgroundColor: "#5d97b3" }}
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link
                                onClick={() => alert("Not implemented")}
                                href="#"
                                variant="body2"
                            >
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link
                                onClick={() => history.push("/register")}
                                href="#"
                                variant="body2"
                            >
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};

export default Login;
