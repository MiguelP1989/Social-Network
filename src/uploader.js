import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDiMount() {
        console.log("uploader did mounted");
        console.log("props", this.props);
    }
    upload(e) {
        e.preventDefault();
        let formData = new FormData();
        formData.append("file", e.target.files[0]);

        axios.post("/upload", formData).then(resp => {
            console.log("uploaaaad, :", resp.data.image.url);

            this.props.methodInApp(resp.data.image.url);
        });
    }

    render() {
        return (
            <div className="outer-modal">
                <div className="inner-modal">
                    <div className="Xclose-modal">
                        <h1 id="x" onClick={this.props.closeModal}>
                            X
                        </h1>
                    </div>
                    <div>
                        <h1>Upload and image</h1>
                        <label id="custom-file-upload">
                            Choose
                            <input
                                type="file"
                                name="file"
                                onChange={e => this.upload(e)}
                            />
                        </label>
                    </div>
                </div>
            </div>
        );
    }
}
