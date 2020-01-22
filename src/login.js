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
                mode: "bubble"
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
                size: 15,
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

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    submit(e) {
        e.preventDefault();
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
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
        console.log(("this.state", this.state));
    }
    render() {
        return (
            <div className="wrapperlogin">
                <div className="logoLogin">
                    <div>
                        <img src="images/logo.png" />
                    </div>
                </div>
                <Particles className="particles" params={ParticlesObjs} />
                <div className="form-wrapper">
                    <h1>Login</h1>
                    <form>
                        <div className="email">
                            <label htmlFor="email">Email</label>
                            <input
                                name="email"
                                placeholder="email"
                                onChange={e => this.handleChange(e.target)}
                            />
                        </div>
                        <div className="password">
                            <label htmlFor="password">Password</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                onChange={e => this.handleChange(e.target)}
                            />
                        </div>
                        <div>
                            {this.state.error && (
                                <div
                                    className="error"
                                    style={{
                                        color: "white"
                                    }}
                                >
                                    OOPPS! Something went wrong.
                                </div>
                            )}
                        </div>
                        <div className="createAccount">
                            <button onClick={e => this.submit(e)}>
                                Submit
                            </button>
                            <small>
                                Dont you have an Account?{" "}
                                <Link className="pleaseregister" to="/">
                                    Please Register
                                </Link>
                            </small>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
