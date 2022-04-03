let accessToken = "";

export const getAccessToken = () => {
    return accessToken;
};

export const setAccessToken = (token: string) => {
    console.log(token, 'token');
    accessToken = token;

    return accessToken;
};
