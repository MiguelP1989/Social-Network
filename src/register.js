import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";
import Particles from "react-particles-js";

const ParticlesObjs = {
    particles: {
        number: {
            value: 40,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: "#ffffff"
        },
        shape: {
            type: "image",

            stroke: {
                width: 0,
                color: "#000000"
            },
            polygon: {
                nb_sides: 5
            },
            image: {
                src: "images/contact.png",
                width: 100,
                height: 100
            }
        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {
                enable: false,
                speed: 0,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 10,
            random: true,
            anim: {
                enable: false,
                speed: 0,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 250,
            color: "#ffffff",
            opacity: 0.4,
            width: 2
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "repulse"
            },
            onclick: {
                enable: true,
                mode: "push"
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 800,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 800,
                size: 80,
                duration: 2,
                opacity: 0.8,
                speed: 3
            },
            repulse: {
                distance: 190,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
};

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            passworderror: false,
            failevalidation: "",
            emailerror: false,
            failemailvalidation: "",
            firsterror: false,
            failfirstvalidation: ""
        };
    }
    submit(e) {
        e.preventDefault();

        axios
            .post("/register", {
                email: this.state.email,
                password: this.state.password,
                first: this.state.first,
                last: this.state.last
            })
            .then(({ data }) => {
                console.log("data email validation", data);
                if (data.success) {
                    // location.href = "/";
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
    }
    handleChange(inputElement) {
        this.setState({
            [inputElement.name]: inputElement.value
        });

        // console.log(("this.state", this.state));
        if (this.state.password && this.state.password.length < 6) {
            this.setState({
                passworderror: true,
                failevalidation: "invalid"
            });
        }
        if (this.state.password && this.state.password.length >= 6) {
            this.setState({
                passworderror: false,
                failevalidation: ""
            });
        }
        const emailTest = /.{1,}(@).{1,}/i;
        if (this.state.email && !emailTest.test(this.state.email)) {
            this.setState({
                emailerror: true,
                failemailvalidation: "invalid"
            });
        }
        if (this.state.email && emailTest.test(this.state.email)) {
            this.setState({
                emailerror: false,
                failemailvalidation: ""
            });
        }
    }
    render() {
        return (
            <div>
                <div className="logomaintitle">
                    <div>
                        <h2>YOU</h2>
                    </div>
                    <img src="images/logo.png" />
                    <div>
                        <h2>AND CONNECT</h2>
                    </div>
                </div>

                <div className="wrapper">
                    <Particles className="particles" params={ParticlesObjs} />
                    <div className="form-wrapper">
                        <h1>Create an Account</h1>
                        <form>
                            <div className="firstname">
                                <label htmlFor="firstname">First Name</label>
                                <input
                                    name="first"
                                    type="text"
                                    placeholder="First"
                                    onChange={e => this.handleChange(e.target)}
                                />
                            </div>
                            <div className="lastname">
                                <label htmlFor="lastname">Last Name</label>
                                <input
                                    name="last"
                                    type="text"
                                    placeholder="Last"
                                    onChange={e => this.handleChange(e.target)}
                                />
                            </div>
                            <div className="email">
                                <label htmlFor="email">Email</label>
                                <input
                                    className={this.state.failemailvalidation}
                                    name="email"
                                    type="text"
                                    placeholder="email"
                                    onChange={e => this.handleChange(e.target)}
                                />
                                <div>
                                    {this.state.emailerror && (
                                        <div
                                            className="error"
                                            style={{
                                                color: "white"
                                            }}
                                        >
                                            Invalid email
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="password">
                                <label htmlFor="password">Password</label>
                                <input
                                    className={this.state.failevalidation}
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    onChange={e => this.handleChange(e.target)}
                                />
                                <div>
                                    {this.state.passworderror && (
                                        <div
                                            className="error"
                                            style={{
                                                color: "white"
                                            }}
                                        >
                                            Minimun seven characters necessary
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                {this.state.error && (
                                    <div
                                        className="error"
                                        style={{
                                            color: "white"
                                        }}
                                    >
                                        Oops! Something went wrong
                                    </div>
                                )}
                            </div>
                            <div className="createAccount">
                                <button
                                    disabled={
                                        this.state.emailerror ||
                                        this.state.passworderror
                                    }
                                    onClick={e => this.submit(e)}
                                >
                                    Submit
                                </button>
                                <small>
                                    Already have an Account?{" "}
                                    <Link className="login" to="/login">
                                        Please Login
                                    </Link>
                                </small>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
