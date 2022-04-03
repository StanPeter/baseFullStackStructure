import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import {
    ApolloClient,
    ApolloLink,
    HttpLink,
    InMemoryCache,
} from "@apollo/client";
import App from "App";
import { getAccessToken, setAccessToken } from "utils/getToken";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from "jwt-decode";
import { onError } from "@apollo/client/link/error";
// import { createStore, combineReducers, applyMiddleware, compose } from "redux";
// import thunk from "redux-thunk";
// import trialReducer from "store/reducers/reducer";
// import { Provider } from "react-redux";

// http link with the correct BE api url and credentials (to get cookies)
const httpLink = new HttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: "include",
});

// each time before request get the accessToken and send in headers
const authLink = new ApolloLink((operation, forward) => {
    // retrieve the authorization token from local storage.
    const token = getAccessToken();

    // use the setContext method to set the HTTP headers.
    operation.setContext({
        headers: {
            authorization: token ? `Bearer ${token}` : "",
        },
    });

    // call the next link in the middleware chain.
    return forward(operation);
});

// on error show console log correctly
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        );

    if (networkError) console.log(`[Network error]: ${networkError}`);
});

//refreshing login after access token expired
const refreshLink = new TokenRefreshLink({
    // name of the access token in our response
    accessTokenField: "accessToken",
    // if token not yet expired or user doesn't have a token (guest) true should be returned
    isTokenValidOrUndefined: () => {
        const token = getAccessToken();

        if (!token) return true;

        try {
            const { exp }: { exp: number } = jwtDecode(token);

            if (Date.now() >= exp * 1000) return false;
            return true;
        } catch {
            return false;
        }
    },
    //where to send the request
    fetchAccessToken: () => {
        return fetch("http://localhost:4000/refresh_token", {
            method: "POST",
            credentials: "include",
        });
    },
    //callback after the request
    handleFetch: (accessToken) => {
        setAccessToken(accessToken);
    },
    handleError: (err) => {
        console.warn("Your refresh token is invalid. Try to relogin");
        console.error(err);
    },
});

const cache = new InMemoryCache({});

const client = new ApolloClient({
    // works as a concat of many links
    link: ApolloLink.from([refreshLink, errorLink, authLink, httpLink]),
    cache,
});

// const client = new ApolloClient({
//     cache: new InMemoryCache(),
//     link: authLink.concat(httpLink),
// });

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById("root")
);
