//   map returns a new array

export default function reducer(state = {}, action) {
    console.log("state:", state);

    if (action.type === "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            users: action.users
        };
    }

    if (action.type === "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            users: state.users.map(user => {
                if (user.id == action.id) {
                    return {
                        ...user,
                        accepted: true
                    };
                } else {
                    return user;
                }
            })
        };
    }
    if (action.type === "UNFRIEND")
        state = {
            ...state,
            users: state.users.filter(user => user.id != action.id)
        };

    // //// chat ////
    if (action.type === "10_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.chatmessages
        };
    }

    if (action.type === "ADD_MESSAGE") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.newmessage]
        };
    }
    /////////////////  onlineusers ////.////

    if (action.type == "ONLINE_USERS_LIST") {
        state = {
            ...state,
            onlineUsers: action.onlineUsers
        };
    }

    if (action.type == "USER_WHO_JOINED") {
        console.log("actionn new user...", action);
        state = {
            ...state,
            onlineUsers: [...state.onlineUsers, action.newUser[0]]
        };
    }
    if (action.type == "USER_WHO_LEFT") {
        console.log("action user left", action);
        state = {
            ...state,
            onlineUsers: [...state.onlineUsers].filter(
                user => user.id !== action.userLeft
            )
        };
    }
    return state;
}

// action is an object that is gonna define wich change we gonna make
//  map -> array method that will loop through an array and allow us to modify all elements within the array.
//  It returns a new array and does not modify the original array untouched
//
// let arr =[1, 2, 3] ;\
//
// let newArr = arr.map(elem => {
//     return elem + 1
// })
// console.log(newArr);
//
// filter -> array method used to remove items in an array.
//  It returns a new array and does not modify the original array untouched
//
// let arr =[1, 2, 3] ;\
//
// let newArr = arr.filter(elem => {
//    return elem !== 1
// })
// console.log(newArr);

// if (action.type == "USER_WHO_JOINED") {
//     var newUser = action.newUser;
//     return (state = {
//         ...state,
//         listOfUsersOnline:
//             state.listOfUsersOnline &&
//             state.listOfUsersOnline.concat(newUser)
//     });
// }
//
// if (action.type == "USER_WHO_LEFT") {
//     return (state = {
//         ...state,
//         listOfUsersOnline:
//             state.listOfUsersOnline &&
//             state.listOfUsersOnline.filter(
//                 userOnline => userOnline.id !== action.userLeft
//             )
//     });
// }
