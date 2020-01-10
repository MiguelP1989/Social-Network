import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import { Friendshipbutton } from "./friendship-button";

export default class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        console.log("this.props.match: ", this.props.match);

        axios
            .get("/api/userprofile/" + this.props.match.params.id)
            .then(({ data }) => {
                console.log("datain paramsid", data);
                if (this.props.match.params.id == data.loginuser) {
                    this.props.history.push("/");
                    return false;
                }
                this.setState({
                    first: data.otheruser.first,
                    last: data.otheruser.last,
                    imgurl: data.otheruser.url,
                    id: data.otheruser.id,
                    bio: data.otheruser.bio
                });
            })
            .catch(err => {
                this.props.history.push("/");
                console.log("err", err);
            });
        // figure out the id of the user....
        console.log("this.props.match.params.id:", this.props.match.params.id);
        // we want to make a request to the server, passing along this.props.match.params.id;
        // the server needs to look up the data about that user;
        // and send back the info about the currently logged in user
        // we need to figure out if other usersid is the same is the same as the logged in users id;
        //  if it is then send them away
    }
    render() {
        return (
            <div className="profile">
                <div className="profile-wrap">
                    <h3 className="profile-name">
                        {this.state.first} {this.state.last}
                    </h3>
                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        imgurl={this.state.imgurl}
                        ProfilePicClass="profile-pic"
                    />
                    <Friendshipbutton
                        className=""
                        otherId={this.props.match.params.id}
                    />
                </div>
                <div className="other-profile-bio">
                    <p>{this.state.bio}</p>
                </div>
            </div>
        );
    }
}
