import React, { useState } from "react";
import { useHistory } from "react-router";
import { useGetUserQuery, useLogoutMutation } from "generated/graphql";
import { setAccessToken } from "utils/getToken";
import { CgCrown } from "react-icons/cg";
import { BiLogIn } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { AiOutlineFire } from "react-icons/ai";

interface NavbarProps {}

const toggler = (links: NodeListOf<Element>, nameOfClass: string) => {
    links.forEach((link) => {
        link.classList.toggle(nameOfClass);
    });
};

const Navbar: React.FC<NavbarProps> = () => {
    const history = useHistory();

    const [navExpanded, setNavExpanded] = useState(false);
    const { data, loading } = useGetUserQuery();
    const [logout, { client }] = useLogoutMutation();

    const hamburgerClickHandler = () => {
        const navLinks = document.querySelector(".navbar-links")!;
        const links = document.querySelectorAll(".navbar-links li");

        if (!navExpanded) {
            setNavExpanded(true);
            toggler(links, "nav-link-transition");

            setTimeout(() => {
                toggler(links, "nav-link-transition");
            }, 1000);
        } else {
            toggler(links, "nav-link-transition");

            setTimeout(() => {
                setNavExpanded(false);
                toggler(links, "nav-link-transition");
            }, 1000);
        }

        navLinks.classList.toggle("open");
        toggler(links, "fade");
    };

    const authButtons = (hide: boolean) => {
        if (data?.getUser)
            return (
                <li
                    className={hide ? "hideNav" : ""}
                    onClick={async () => {
                        await logout();
                        setAccessToken("");
                        await client.resetStore();
                    }}
                >
                    Logout
                </li>
            );
        else if (!data?.getUser && !loading)
            return (
                <li
                    className={hide ? "hideNav" : ""}
                    onClick={() => {
                        //if open then close hamburger
                        if (navExpanded) hamburgerClickHandler();
                        history.push("/login");
                    }}
                >
                    <BiLogIn className="login-icon" />
                </li>
            );
        return null;
    };

    return (
        <nav
            className="navbar"
            style={{ marginBottom: navExpanded ? "20rem" : undefined }}
        >
            <div className="logo">
                <CgCrown />
                Langyboost
            </div>
            <ul className="navbar-links left">
                <li
                    onClick={() => {
                        if (navExpanded) hamburgerClickHandler();
                        history.push("/");
                    }}
                >
                    Courses
                </li>
                <li
                    onClick={() => {
                        if (navExpanded) hamburgerClickHandler();
                        history.push("/admin");
                    }}
                >
                    Articles
                </li>
                <li>Resources</li>
                {authButtons(true)}
            </ul>
            <ul className="navbar-links right">
                <li >
                    <p>2</p>
                    <AiOutlineFire className="fire-icon" />
                </li>
                <li>
                    <p>5</p>
                    <img
                        className="profile-icon"
                        alt="sweden"
                        height="30"
                        width="30"
                        src="https://static.posters.cz/image/750/placky-odznaky/flag-sweden-i2430.jpg"
                    />
                </li>
                <li>
                    <p className="profile-name">Jill</p>
                    <img
                        className="profile-icon"
                        alt="girl"
                        height="30"
                        width="30"
                        src="https://i.pinimg.com/originals/f4/89/fb/f489fb6beea688dfdc6bb2181b04f12a.jpg"
                    />
                </li>
                <hr style={{ height: "30px" }} />
                <li >
                    <FiSettings className="settings-icon"/>
                </li>
                <hr style={{ height: "30px" }} />
                {authButtons(false)}
            </ul>
            <div className="hamburger" onClick={hamburgerClickHandler}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>
        </nav>
    );
};

export default Navbar;
