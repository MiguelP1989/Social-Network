import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function OnlineUsers() {
    const onlineUsers = useSelector(state => state && state.onlineUsers);

    console.log("onlineUsreeeeers  ", onlineUsers);
    if (!onlineUsers) {
        return null;
    }

    return (
        <div className="online-users-container">
            <h3>Online now</h3>
            <div className="online-users-inner-container">
                {onlineUsers &&
                    onlineUsers.map(user => {
                        return (
                            <div className="r" key={user.id}>
                                <div className="users-chat-container">
                                    <div className="users-online">
                                        <p>
                                            {user.first} {user.last}
                                            <Link to={`/user/${user.id}`}>
                                                <div className="green"></div>
                                                <img
                                                    className="chat-pic"
                                                    src={user.url}
                                                />
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
