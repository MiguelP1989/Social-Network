import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        console.log("prrroooops....:");
        super(props);
        this.state = {
            editingMode: false,
            buttonText: "Edit Bio.."
        };

        this.handlechange = this.handlechange.bind(this);
        this.submitBio = this.submitBio.bind(this);
    }

    componentDidMount() {
        console.log("props in BioEditor...", this.props);
        if (!this.props.bio) {
            console.log("no bio...!!");
            this.setState(
                {
                    buttonText: "Add your bio"
                },
                () => console.log("this.state:", this.state)
            );
        }
    }
    showTextArea() {
        console.log("toggleModal is running!!");
        this.setState({
            editingMode: !this.state.editingMode
            // on screen show or not show / set false to be true
        });
    }
    handlechange(e) {
        console.log("e.target.value", e.target.value);

        this.setState({
            bio: e.target.value
        });
    }

    submitBio() {
        if (!this.state.bio) {
            this.showTextArea();
            return;
        }
        axios.post("/bio", this.state).then(({ data }) => {
            console.log("results,", data);
            this.props.updateBio(data[0].bio);
        });

        if (this.state.bio) {
            this.setState({
                buttonText: "Edit bio",
                editingMode: !this.state.editingMode
            });
        } else {
            this.setState({
                buttonText: "Add bio",
                editingMode: this.state.editingMode
            });
        }

        console.log("this.state.bio", this.state.bio);
    }

    render() {
        console.log("this.pros ", this.props);

        if (!this.state.editingMode) {
            return (
                <div>
                    <div className="adddyourbio">
                        <img
                            src="images/addbio.png"
                            onClick={e => this.showTextArea(e)}
                            className="bioeditor-editimage"

                            // {this.state.buttonText}
                        />
                        <p
                            className="buttonText"
                            onClick={e => this.showTextArea(e)}
                        >
                            {this.state.buttonText}
                        </p>
                    </div>
                    <div>
                        <p className="newlines">{this.props.bio}</p>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div className="bio-editor">
                        <img
                            src="images/save.png"
                            className="bioeditor-savebutton"
                            onClick={this.submitBio}
                        />
                        <p onClick={this.submitBio}>Save</p>
                    </div>
                    <div>
                        <p className="newlines">{this.props.bio}</p>
                    </div>

                    <div>
                        <textarea
                            name="bio"
                            type="text"
                            defaultValue={this.props.bio}
                            onChange={e => this.handlechange(e)}
                        />
                    </div>
                </div>
            );
        }
    }
}

// let buttonText;
// this.props.bio ? (buttonText = "edit your bio") : (buttonText = "add your bio");
// console.log("buttonText: ", buttonText);

// static getDerivedStateFromProps
