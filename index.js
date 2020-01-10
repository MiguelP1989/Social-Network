const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./utils/db");
const { hash, compare } = require("./utils/bc");
const csurf = require("csurf");
const s3 = require("./s3");
const { s3Url } = require("./config");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

// in front of localhost:8080 -> socialnetwork.herokuapp.com:*

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(
    express.urlencoded({
        extended: false
    })
);

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(compression());
app.use(express.json());
app.use(express.static("./public"));

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

////////// GET /friends-wannabes //////

app.get("/friendsWannabes", function(req, res) {
    db.relationships(req.session.userId)
        .then(results => {
            console.log("results in friendsWannabees...", results);

            res.json({
                results: results.rows,
                user: req.session.userId
            });
        })
        .catch(e => {
            console.log("e: ", e);
        });
});

// //// delete friendshiprequest /////

app.post("/deleteRequest/:otherId", function(req, res) {
    db.deleteRequest(req.params.otherId, req.session.userId)
        .then(results => {
            res.json({
                buttonText: "Make a friendship request"
            });
            console.log("ressuuuuuults in deleteRequest", results);
        })
        .catch(e => console.log("e", e));
});

/////// apdate friendship////

app.post("/acceptFriendRequest/:otherId", function(req, res) {
    db.acceptFriendRequest(req.params.otherId, req.session.userId).then(
        results => {
            console.log("ressuuuuuults in acceptFriendRequest", results);
            res.json({
                buttonText: "End fiendship"
            });
        }
    );
});

/////////////      ADDD A FRIEND       ////////////

app.post("/friendRequest/:otherId", function(req, res) {
    db.addfriend(req.session.userId, req.params.otherId).then(results => {
        if (results.rows.length == 0) {
            res.json({
                buttonText: "Make a friendship request"
            });
        }

        if (results.rows.length > 0) {
            if (results.rows[0].accepted == true) {
                res.json({
                    buttonText: "End Friendship"
                });
            }
            if (results.rows[0].sender_id == req.session.userId) {
                res.json({
                    buttonText: "cancel friendship request"
                });
            } else {
                res.json({
                    buttonText: "Accept friendship request"
                });
            }
        }
    });
});

///////////      Friendshipbutton       ///////////

app.get("/friendshipstatus/:otherId", function(req, res) {
    // console.log("req.params", req.params.otherId);
    db.friendshipRequest(req.params.otherId, req.session.userId)
        .then(results => {
            console.log("results...", results);
            if (results.rows.length == 0) {
                res.json({
                    buttonText: "Make a friendship request"
                });
            }

            if (results.rows.length > 0) {
                if (results.rows[0].accepted == true) {
                    res.json({
                        buttonText: "End Friendship"
                    });
                }
                if (
                    results.rows[0].sender_id == req.session.userId &&
                    results.rows[0].accepted == false
                ) {
                    res.json({
                        buttonText: "cancel friendship request"
                    });
                } else {
                    res.json({
                        buttonText: "Accept friendship request"
                    });
                }
            }
        })
        .catch(err => {
            console.log("err..", err);
        });
});

// /////// Find new users //////

app.get("/api/getusers", function(req, res) {
    db.findnewUsers(req.session.userId).then(data => {
        console.log("data in getusers:", data);
        res.json(data.rows);
    });
});

// //////////Find people   //////

app.get("/getusers/:val", function(req, res) {
    console.log("params.val...:", req.params);

    db.findUsers(req.params.val)
        .then(data => {
            console.log("roooows in findtusers:", data);

            res.json(data.rows);
        })
        .catch(err => {
            console.log("err..", err);
        });
});

//////////////////////////////////////

app.get("/userprofile.json", (req, res) => {
    db.getUserProfile(req.session.userId).then(({ rows }) => {
        res.json(rows[0]);
    });
});

//////// view other users' profile pages /////

app.get("/api/userprofile/:id", (req, res) => {
    db.getOtherProfiles(req.params.id).then(results => {
        res.json({
            otheruser: results.rows[0],
            loginuser: req.session.userId
        });
    });
});

///////////// BIOOOOO ///////
app.post("/bio", (req, res) => {
    db.setBio(req.session.userId, req.body.bio)
        .then(results => {
            res.json(results.rows);
        })
        .catch(err => {
            console.log("error in updating bio: ", err);
            res.json({
                success: false
            });
        });
});

//////// UPLOAD

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    // console.log("this is the upload file...!");
    // console.log("input....:", req.file);
    // console.log(("input...", req.file));
    const imageUrl = `${s3Url}/${req.file.filename} `;
    // console.log("imageUrl", imageUrl);
    // console.log("userid..", req.session.userId);
    db.addImage(imageUrl, req.session.userId)
        .then(({ rows }) => {
            if (req.file) {
                console.log("rows[0]", rows[0]);
                res.json({
                    image: rows[0],
                    success: true
                });
            }
        })
        .catch(err => {
            console.log("err...", err);
        });
});

// /////////////   WELCOME      ///////

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
//

////////// register ////////////////////////

app.post("/register", async (req, res) => {
    console.log("req.body: ", req.body);
    const { first, last, email, password } = req.body;

    try {
        let hashedPassword = await hash(password);
        let id = await db.register(first, last, email, hashedPassword);
        console.log("hashedPassword", hashedPassword);

        req.session.userId = id.rows[0].id;
        req.session.first = first;
        req.session.last = last;
        req.session.email = email;
        res.json({
            success: true
        });
    } catch (e) {
        console.log("e in post registration: ", e);
        res.json({
            success: false
        });
    }
});

// //////////////// LOGIN ////////////

app.post("/login", (req, res) => {
    let email = req.body.email;
    let pass = req.body.password;
    //
    db.getUserInfo(email)
        .then(results => {
            let hashPass = results.rows[0].password;
            let userId = results.rows[0].id;

            compare(pass, hashPass)
                .then(match => {
                    console.log("maaaatch ", match);

                    if (match) {
                        req.session = {
                            userId: userId
                        };

                        res.json({ success: true });
                    }
                })
                .catch(err => {
                    console.log("error in password: ", err);
                    res.json({ success: false });
                });
        })
        .catch(err => {
            console.log("error in email: ", err);
            res.json({ success: false });
        });
});

/////////LOGOUT

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome#/login");
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function() {
    console.log("I'm listening.");
});

/////////// chaaat /////

const onlineUsers = {};

io.on("connection", function(socket) {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    const userId = socket.request.session.userId;

    ////GET THE list of onlione users
    onlineUsers[socket.id] = userId;
    let arrOfIds = Object.values(onlineUsers);

    db.getUsersByIds(arrOfIds)
        .then(results => {
            socket.emit("onlineUsers", results.rows);
        })
        .catch(err => {
            console.log("error in  getUsersByIds", err);
        });

    console.log("ID who joined", arrOfIds.slice(-1)[0]);
    if (arrOfIds.indexOf(userId) == arrOfIds.length - 1) {
        var newUser = arrOfIds.slice(-1)[0];
        db.getUserWhoJoined(newUser)
            .then(results => {
                socket.broadcast.emit("userJoined", results.rows);
            })
            .catch(err => {
                console.log("error in getUserWhoJoined", err);
            });
    }

    // updatE  when a person logs out/////

    socket.on("disconnect", function() {
        delete onlineUsers[socket.id];
        if (!Object.values(onlineUsers).includes(userId)) {
            io.sockets.emit("userLeft", userId);
        }
    });

    //////////  rendering the messages //////

    db.getLastTenChatMessages()
        .then(data => {
            io.emit("chatMessages", data.rows.reverse());
        })
        .catch(err => {
            console.log("error in tenChatMessages..", err);
        });

    // chat message ////
    db.getUserProfile(userId).then(data => {
        socket.request.first = data.rows[0].first;
        socket.request.last = data.rows[0].last;
        socket.request.url = data.rows[0].url;
    });

    // make a db query to get the last chat chatMessages
    socket.on("My amazing chat message", msg => {
        console.log("yyoooooo");
        db.addChatMessages(userId, msg)
            .then(resp => {
                io.emit("newMessage", {
                    created_at: resp.rows[0].created_at,
                    id: resp.rows[0].id,
                    message: resp.rows[0].message,
                    first: socket.request.first,
                    last: socket.request.last,
                    url: socket.request.url
                });
            })

            .catch(err => {
                console.log("err in addchat..", err);
            });

        // console.log("msg on the  server", msg);
        // console.log("userId", userId);
        // we need to look up info about the useR
        // then add it to the DATABASE_URL
        // then enit to everyone
        // io.socket.emit("newMessage", msg);
    });
});

/* ... */

// io.on("connection", function(socket) {
//     console.log(`socket with the id ${socket.id} is now connected`);
//
//     socket.emit("hello", { message: "nice too see u" });
//
//     // io.sockets.sockets[socket.id].emit("hello", { message: "nice too see u" }); -> private messages
//
//     socket.on("rby", data => {
//         console.log(data);
//     });
//     // socket.broadcast
//     io.sockets.emit("someoneNew", {
//         id: socket.id
//     });
//
//     io.sockets.sockets;
//
//     socket.on("disconnect", function() {
//         console.log(`socket with the id ${socket.id} is now disconnected`);
//     });
// });
