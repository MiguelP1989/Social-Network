import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import { BrowserRouter, Route } from "react-router-dom";
import OtherProfile from "./otherprofile";
import { FindPeople } from "./findpeople";
import { Link } from "react-router-dom";
import Friends from "./friends";
import Chat from "./chat";
import OnlineUsers from "./onlineUsers";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last: "",
            imgurl: "",
            uploaderIsVisible: false
        };
    }

    componentDidMount() {
        console.log("app has mounted");
        axios.get("/userprofile.json").then(({ data }) => {
            console.log("data...", data);
            this.setState({
                first: data.first,
                last: data.last,
                imgurl: data.url,
                id: data.id,
                bio: data.bio,
                uploaderIsVisible: false
            });
        });

        // / this is where we want to contact the server and ask for info about the users
        // axios.get()
        // when we get the info back, we want to add it to state...
        // this.setState({})
    }
    toggleModal() {
        console.log("toggleModal is running!!");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible
        });
    }
    closeModal() {
        this.setState({
            uploaderIsVisible: false
        });
    }
    updateBio(bio) {
        console.log("i am method in app");

        this.setState({
            bio: bio
        });
    }
    methodInApp(imageUrl) {
        console.log("i am method in app");
        this.setState({
            imgurl: imageUrl
        });
        this.toggleModal();
    }

    render() {
        if (!this.state.id) {
            return null;
        }
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <div className="header">
                            <div className="header-links-box">
                                <div>
                                    <Link className="link-header" to={"/chat"}>
                                        Chat
                                    </Link>
                                    <Link
                                        className="link-header"
                                        to={"/friends"}
                                    >
                                        Friends
                                    </Link>

                                    <Link
                                        className="link-header"
                                        to={"/getusers"}
                                    >
                                        Find Friends
                                    </Link>
                                    <Link className="link-header" to={"/"}>
                                        Profile
                                    </Link>
                                    <a className="link-header" href="/logout">
                                        Logout
                                    </a>
                                </div>
                            </div>

                            <ProfilePic
                                ProfilePicClass="small-picture"
                                togglefunction={this.toggleModal.bind(this)}
                                first={this.state.first}
                                last={this.state.last}
                                imgurl={this.state.imgurl}
                            />
                            {this.state.uploaderIsVisible && (
                                <Uploader
                                    methodInApp={this.methodInApp.bind(this)}
                                    closeModal={this.closeModal.bind(this)}
                                />
                            )}
                        </div>
                        <hr />
                        <div className="main">
                            <div className="backgroundlogo-container">
                                <img
                                    className="backgroundlogo"
                                    src="images/backgroundlogo.jpg"
                                ></img>
                            </div>
                            <div>
                                <Route
                                    exact
                                    path="/"
                                    render={() => (
                                        <Profile
                                            first={this.state.first}
                                            last={this.state.last}
                                            imgurl={this.state.imgurl}
                                            id={this.state.id}
                                            updateBio={this.updateBio.bind(
                                                this
                                            )}
                                            togglefunction={this.toggleModal.bind(
                                                this
                                            )}
                                            bio={this.state.bio}
                                        />
                                    )}
                                />
                            </div>
                            <Route path="/user/:id" component={OtherProfile} />
                            <Route path="/getusers" component={FindPeople} />
                            <Route path="/friends" component={Friends} />
                            <Route path="/chat" component={Chat} />
                            <Route
                                path="/onlineusers"
                                component={OnlineUsers}
                            />
                        </div>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
