import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bio-editor";
import OnlineUsers from "./onlineusers";

export default function Profile(props) {
    console.log("props in profile+++++++++, ", props);
    return (
        <div className="profile">
            <div className="profile-wrap">
                <h3 className="profile-name">
                    {props.first} {props.last}
                </h3>
                <ProfilePic
                    first={props.first}
                    last={props.last}
                    imgurl={props.imgurl}
                    ProfilePicClass="profile-pic"
                    togglefunction={props.togglefunction}
                />
            </div>
            <div>
                <OnlineUsers />
            </div>
            <div className="bioedit-container">
                <BioEditor updateBio={props.updateBio} bio={props.bio} />
            </div>
        </div>
    );
}
