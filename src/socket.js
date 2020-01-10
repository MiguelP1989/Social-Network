import * as io from "socket.io-client";

import { loadChatMessages, newMessage } from "./actions";
import {
    showListOfOnlineUsers,
    showUserWhoJoined,
    hideUserWhoLeft
} from "./actions";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", msgs =>
            store.dispatch(loadChatMessages(msgs))
        );

        socket.on("newMessage", msg => store.dispatch(newMessage(msg)));
    }

    socket.on("onlineUsers", listofOnlineUsers => {
        console.log("listofOnlineUsers", listofOnlineUsers);
        store.dispatch(showListOfOnlineUsers(listofOnlineUsers));
    });

    socket.on("userJoined", userWhoJoined => {
        console.log("showUserWhoJoined", userWhoJoined);
        store.dispatch(showUserWhoJoined(userWhoJoined));
    });

    socket.on("userLeft", userWhoLeft => {
        store.dispatch(hideUserWhoLeft(userWhoLeft));
    });
};

// const socket = io.connect();
//
// socket.on("hello", data => {
//     console.log("data", data);
//     socket.emit("rbay", {
//         message: "i am glad to see you too"
//     });
// });
//
// socket.on("someoneNew", console.log);
