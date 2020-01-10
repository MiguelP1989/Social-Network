import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProfilePic from "./profilepic";
import {
    receiveFriendsWannabes,
    acceptFriendRequest,
    unfriend
} from "./actions";

export default function Friends() {
    const dispatch = useDispatch();
    const users = useSelector(state => {
        return state.users && state.users.filter(user => user.accepted == true);
    });
    const wannabes = useSelector(state => {
        return (
            state.users && state.users.filter(user => user.accepted == false)
        );
    });

    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);
    console.log("users", users);
    if (!users) {
        return null;
    }

    return (
        <div className="friends-requests-box">
            <div>
                <div className="friends-box">
                    <div className="friendsText-logo">
                        <div className="wrapper-friendsText-logo">
                            <img
                                className="logoinFriends"
                                src="/images/backgroundlogo.jpg"
                            ></img>
                            <h2>Friends</h2>
                        </div>
                    </div>
                    <div className="nofriends-message">
                        {wannabes &&
                            (users.length == 0 ? (
                                <p className="sadlogo">
                                    <img
                                        className="sadlogo"
                                        src="/images/sadlogo.png"
                                    />
                                </p>
                            ) : (
                                <p>{users.length}</p>
                            ))}
                    </div>
                    <div className="recentusers">
                        {users.map(user => {
                            return (
                                <div className="friend" key={user.id}>
                                    <div className="friend-wrapper">
                                        <h3 className="friend-name">
                                            {user.first} {user.last}
                                        </h3>
                                        <div className="user-pic">
                                            <Link to={`/user/${user.id}`}>
                                                <ProfilePic
                                                    imgurl={user.url}
                                                    ProfilePicClass="profile-pic"
                                                />
                                            </Link>
                                        </div>
                                        <div className="buttons">
                                            <button
                                                onClick={e =>
                                                    dispatch(unfriend(user.id))
                                                }
                                            >
                                                Unfriend
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="friends-requests-box">
                <div className="friends-box">
                    <div className="friendsText-logo">
                        <div className="wrapper-friendsText-logo">
                            <img
                                className="logoinFriends"
                                src="/images/backgroundlogo.jpg"
                            ></img>
                            <h2>Requests</h2>
                        </div>
                    </div>
                    <div className="noWannabes">
                        {users &&
                            (wannabes.length == 0 ? (
                                <img
                                    className="thinkinglogo"
                                    src="/images/thinking.png"
                                />
                            ) : (
                                <p>{wannabes.length}</p>
                            ))}
                    </div>

                    <div className="recentusers">
                        {wannabes.map(wannabe => {
                            return (
                                <div className="friend" key={wannabe.id}>
                                    <div className="friend-wrap">
                                        <h3 className="friend-name">
                                            {wannabe.first} {wannabe.last}
                                        </h3>
                                        <div className="user-pic">
                                            <Link to={`/user/${wannabe.id}`}>
                                                <ProfilePic
                                                    imgurl={wannabe.url}
                                                    ProfilePicClass="profile-pic"
                                                />
                                            </Link>
                                        </div>
                                        <div className="buttons">
                                            <button
                                                onClick={e =>
                                                    dispatch(
                                                        acceptFriendRequest(
                                                            wannabe.id
                                                        )
                                                    )
                                                }
                                            >
                                                Accept friend Request
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
