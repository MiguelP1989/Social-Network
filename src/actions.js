import axios from "./axios";

export async function receiveFriendsWannabes() {
    const { data } = await axios.get("/friendsWannabes");
    console.log("data in friendswannabees", data);
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        users: data.results
    };
}

export async function acceptFriendRequest(id) {
    const { data } = await axios.post("/acceptFriendRequest/" + id);
    console.log("data in acceptFriendRequest", data);
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        id
    };
}

export async function unfriend(id) {
    const { data } = await axios.post("/deleteRequest/" + id);
    console.log("deleteRequest..", data);
    return {
        type: "UNFRIEND",
        id
    };
}

// ////////    chat /////

export function loadChatMessages(msg) {
    console.log("message in loadChatMessages", msg);
    return {
        type: "10_MESSAGES",
        chatmessages: msg
    };
}

export function newMessage(msg) {
    return {
        type: "ADD_MESSAGE",
        newmessage: msg
    };
}

// ///// onlineusers/////

export function showListOfOnlineUsers(listOfUsersOnline) {
    return {
        type: "ONLINE_USERS_LIST",
        onlineUsers: listOfUsersOnline
    };
}

export function showUserWhoJoined(userWhoJoined) {
    console.log("userWhoJoined..", userWhoJoined);
    return {
        type: "USER_WHO_JOINED",
        newUser: userWhoJoined
    };
}

export function hideUserWhoLeft(userWhoLeft) {
    console.log("userWhoLeft", userWhoLeft);
    return {
        type: "USER_WHO_LEFT",
        userLeft: userWhoLeft
    };
}
