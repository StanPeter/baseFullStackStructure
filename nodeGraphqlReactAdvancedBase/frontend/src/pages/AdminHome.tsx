import { useGetUsersQuery } from "generated/graphql";
import React from "react";

interface HomeProps {}

const AdminHome: React.FC<HomeProps> = () => {
    //network-only makes it to do a request every single time
    const { data, error, loading } = useGetUsersQuery({
        fetchPolicy: "network-only",
    });

    if (error) return <div style={{ color: "red" }}>error {error.message}</div>;
    else if (loading) return <div>...loading</div>;
    else if (!data) return <div>no data</div>;

    return (
        <div className="">
            <h2 style={{ color: "green" }}>This page is a big secret</h2>
            {data.getUsers.map((el, idx: number) => (
                <p key={idx}>hello, your data goes here: {el.email}</p>
            ))}
        </div>
    );
};

export default AdminHome;
