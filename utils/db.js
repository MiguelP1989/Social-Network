var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

module.exports.register = function register(first, last, email, password) {
    return db.query(
        "INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
        [first, last, email, password]
    );
};

module.exports.getUserInfo = function getUserInfo(email) {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

module.exports.addImage = function(imageUrl, userId) {
    return db.query(
        `   UPDATE users SET url = $1
            WHERE id = $2 RETURNING url

                  `,
        [imageUrl, userId]
    );
};

module.exports.getUserProfile = function getUserProfile(userId) {
    return db.query(`SELECT * FROM users WHERE id = $1`, [userId]);
};

exports.setBio = function(id, bio) {
    return db.query(
        `UPDATE users
            SET bio = $2
            WHERE id = $1
            RETURNING bio`,
        [id, bio]
    );
};

exports.getOtherProfiles = function(id) {
    return db.query(
        `SELECT * FROM users
            WHERE id = $1`,
        [id]
    );
};

module.exports.findUsers = function(val) {
    return db.query(
        `SELECT id, first, last, bio, url, created_at
        FROM users
        WHERE first
        ILIKE $1 or last ILIKE $1 LIMIT 4 `,
        [val + "%"]
    );
};

module.exports.findnewUsers = function(userId) {
    return db.query(
        `SELECT id, first, last, bio, url, created_at FROM users
        WHERE id != $1
        ORDER BY id DESC
        LIMIT 3;
        `,
        [userId]
    );
};

module.exports.friendshipRequest = function(receiver, sender) {
    console.log("receiver", receiver);
    console.log("sender", sender);
    return db.query(
        `SELECT * FROM friendships
    WHERE (receiver_id = $1 AND sender_id = $2)
    OR (receiver_id = $2 AND sender_id = $1)`,
        [receiver, sender]
    );
};

module.exports.addfriend = function(sender, receiver) {
    return db.query(
        `
        INSERT INTO friendships (sender_id, receiver_id)
        VALUES ($1, $2) RETURNING *
        ;`,
        [sender, receiver]
    );
};

module.exports.acceptFriendRequest = function(sender, receiver) {
    return db.query(
        `  UPDATE friendships SET  accepted = true
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1) RETURNING *
         `,
        [sender, receiver]
    );
};

module.exports.deleteRequest = function(sender, receiver) {
    return db.query(
        `DELETE from friendships WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1) `,
        [sender, receiver]
    );
};

module.exports.relationships = function(userId) {
    return db.query(
        `SELECT users.id, first, last, url, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
        `,
        [userId]
    );
};

// exports.deleteAccountFromFriendships = function(id) {
//     return db.query(
//         `DELETE FROM friendships
//             WHERE receiver = $1
//             OR sender = $1`,
//         [id]
//     );
// };
//
// exports.deleteAccountFromUsers = function(id) {
//     return db.query(
//         `DELETE FROM users
//             WHERE id = $1`,
//         [id]
//     );
// };\

// exports.deleteAccountFromChats = function(id) {
//     return db
//         .query(
//             `DELETE FROM chats
//             WHERE sender_id = $1`,
//             [id]
//         )
//
// };

exports.addChatMessages = function(sender_id, message) {
    return db.query(
        `INSERT INTO chats (sender_id, message) VALUES ($1, $2) RETURNING *`,
        [sender_id, message]
    );
};

exports.getLastTenChatMessages = function() {
    return db.query(
        `SELECT chats.id, sender_id, chats.message, chats.created_at, users.first, users.last, users.url
        FROM chats
        LEFT JOIN users ON users.id = chats.sender_id
        ORDER BY chats.id
        DESC LIMIT 10`
    );
};

// //// online users ////

exports.getUsersByIds = function(arrOfIds) {
    return db.query(
        `SELECT *
        FROM users
        WHERE id = ANY($1)`,
        [arrOfIds]
    );
};

// ////// get user who joined update /////

exports.getUserWhoJoined = function(id) {
    return db.query(
        `
            SELECT id, first, last, url
            FROM users
            WHERE id = $1`,
        [id]
    );
};

// SELECT * FROM users
// WHERE ID = ANY($1)

// private chat - profile
