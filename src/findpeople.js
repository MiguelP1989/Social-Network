import React, { useState, useEffect } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import { Link } from "react-router-dom";

export function FindPeople() {
    const [newstUser, setNewstUser] = useState([]);
    const [users, setUser] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        if (searchValue != "") {
            axios.get(`/getusers/${searchValue}`).then(res => {
                console.log("res.data in findusers..", res.data);
                setUser([...res.data]);
            });
        }
    }, [searchValue]);

    useEffect(() => {
        axios.get("/api/getusers/").then(({ data }) => {
            console.log("dataaaaa..", data);
            setNewstUser([...data]);
        });
    }, []);

    return (
        <div>
            <div className="main-box">
                <div className="text-checkoutusers-box">
                    <div className="text-checkoutusers">
                        <div>
                            <h1 className="Checkout-text">
                                Check Out Who is Recently
                            </h1>
                        </div>
                        <div>
                            <img
                                className="logo-in-recentUsers"
                                src="/images/backgroundlogo.jpg"
                            ></img>
                        </div>
                    </div>
                    <div className="recentusers">
                        {newstUser.map(user => {
                            return (
                                <div
                                    className="first-last-link-box"
                                    key={user.id}
                                >
                                    <div className="name-date">
                                        <h3>
                                            {user.first} {user.last}{" "}
                                        </h3>
                                    </div>
                                    <div className="user-pic">
                                        <Link to={`/user/${user.id}`}>
                                            <ProfilePic
                                                imgurl={user.url}
                                                ProfilePicClass="profile-pic"
                                            />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <form>
                <div className="form-wrapper-for-find-users">
                    <label htmlFor="findusersinput">Find users</label>
                    <input
                        className="findusersinput"
                        onChange={e => setSearchValue(e.target.value)}
                        placeholder="Find Users"
                    />
                </div>
            </form>

            <div className="find-users">
                {users.map(user => {
                    return (
                        <div className="box-name" key={user.id}>
                            <div className="names">
                                <Link className="link" to={`/user/${user.id}`}>
                                    <h3>
                                        {user.first} {user.last}{" "}
                                    </h3>
                                </Link>
                            </div>
                            <div className="user-pic">
                                <Link to={`/user/${user.id}`}>
                                    <ProfilePic
                                        imgurl={
                                            user.url || "/images/default.png"
                                        }
                                        ProfilePicClass="profile-pic"
                                    />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// <p>
//     <strong>Since: </strong>
//     {new Date(
//         user.created_at
//     ).toLocaleString()}
// </p>
