import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Chat() {
    const elemRef = useRef();

    const chatMessages = useSelector(state => state && state.chatMessages);

    console.log("chatMessages  ", chatMessages);
    if (!chatMessages) {
        return null;
    }

    useEffect(() => {
        // console.log("chat mounted");
        // console.log("elemRef:", elemRef.current);
        // console.log("scroll top:", elemRef.current.scrollTop);
        // console.log("clientheight ", elemRef.current.clientHeight);
        // console.log("scrollHeight", elemRef.current.scrollHeight);
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages]);

    const keyCheck = e => {
        if (e.key == "Enter") {
            console.log("e.target,value", e.target.value);
            console.log("e.key", e.key);
            socket.emit("My amazing chat message", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div className="chat">
            <div className="chat-container" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map(msg => {
                        return (
                            <div className="" key={msg.id}>
                                <div className="users-chat-container">
                                    <div className="user-info">
                                        <img
                                            className="chat-pic"
                                            src={msg.url}
                                        />
                                        <p>
                                            {msg.first} {msg.last}
                                        </p>
                                    </div>
                                    <div className="message">
                                        <p>
                                            On {""}
                                            {msg.created_at}
                                        </p>
                                        <p>{msg.message}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
            <div className="textarea-box">
                <input
                    className="textarea-chat"
                    placeholder="Add your message here..."
                    onKeyUp={e => keyCheck(e)}
                ></input>
            </div>
        </div>
    );
}
