import React from "react";

export default function ProfilePic({
    first,
    imgurl,
    togglefunction,
    ProfilePicClass
}) {
    console.log("props in profilepic", first);
    console.log("imgurl", imgurl);
    imgurl = imgurl || "/images/default.png";
    return (
        <img
            className={ProfilePicClass}
            src={imgurl}
            onClick={togglefunction}
        />
    );
}
