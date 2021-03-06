import React, { Component } from "react";
import { Button, Container, Col, Row } from "react-bootstrap";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

import configStyles from "../static/css/Config-mallika.module.css";


const play_game_sound = require("../static/assets/sounds/lets-play.mp3");

export default class ThreeConfiguration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beginner: this.props.gameBeginner,
      depth: this.props.depth,
    };
  }

  playAudio(audio_element) {
    const audioEl = document.getElementsByClassName(audio_element)[0];
    audioEl.play();
  }

  render() {
    return (
      <div className={configStyles.wrapper}>
        <Container className={configStyles.mainDiv}>
          <Container
            className={configStyles.containerBody}
            style={{ display: "flex" }}
          >
            <Container
              style={{
                marginTop: "auto",
                marginBottom: "auto",
                padding: "3% 0",
              }}
            >
              <h1 className={configStyles.heading}>
                Select your game configuration
              </h1>
              <Container className={configStyles.startWrapper}>
                <Row className="mb-5">
                  <Col
                    sm={12}
                    md={12}
                    lg={6}
                    className="justify-content-center align-self-center"
                  >
                    <h3 className={configStyles.startContent}>
                      Choose Beginner :
                    </h3>
                  </Col>
                  <Col
                    sm={12}
                    md={12}
                    lg={6}
                    className="justify-content-center align-self-center"
                  >
                    <div
                      style={{
                        textAlign: "center",
                        margin: "0 10%",
                        display: "inline-block",
                      }}
                    >
                      <i
                        className={
                          "fas fa-robot mr-2 " +
                          configStyles.iconStyles +
                          (this.state.beginner === "AGENT"
                            ? " " + configStyles.iconSelect
                            : "")
                        }
                        onClick={(e) => {
                          this.setState({ beginner: "AGENT" });
                          this.props.handleStartAgent_Three(e);
                        }}
                      ></i>
                      <h5 className={configStyles.playerName}>AGENT</h5>
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        margin: "0 10%",
                        display: "inline-block",
                      }}
                    >
                      <i
                        className={
                          "fas fa-user-astronaut mr-2 " +
                          configStyles.iconStyles +
                          (this.state.beginner === "HUMAN"
                            ? " " + configStyles.iconSelect
                            : "")
                        }
                        onClick={(e) => {
                          this.setState({ beginner: "HUMAN" });
                          this.props.handleStartHuman_Three(e);
                        }}
                      ></i>
                      <h5 className={configStyles.playerName}>HUMAN</h5>
                    </div>
                  </Col>
                </Row>
                <Row className="mb-5">
                  <Col
                    sm={12}
                    md={12}
                    lg={6}
                    className="justify-content-center align-self-center"
                  >
                    <h3 className={configStyles.startContent}>
                      Difficulty Level:
                    </h3>
                  </Col>
                  <Col
                    sm={12}
                    md={12}
                    lg={6}
                    className="justify-content-center align-self-center"
                  >
                    <Button
                      size="md"
                      variant="light"
                      className={
                        this.state.depth === 1
                          ? configStyles.selectedButton
                          : ""
                      }
                      onClick={(e) => {
                        this.setState({ depth: 1 });
                        this.props.handleDepth_Three(e, 1);
                      }}
                    >
                      1
                    </Button>
                    <Button
                      size="md"
                      variant="light"
                      className={
                        this.state.depth === 2
                          ? configStyles.selectedButton
                          : ""
                      }
                      onClick={(e) => {
                        this.setState({ depth: 2 });
                        this.props.handleDepth_Three(e, 2);
                      }}
                    >
                      2
                    </Button>
                    <Button
                      size="md"
                      variant="light"
                      className={
                        this.state.depth === 3
                          ? configStyles.selectedButton
                          : ""
                      }
                      onClick={(e) => {
                        this.setState({ depth: 3 });
                        this.props.handleDepth_Three(e, 3);
                      }}
                    >
                      3
                    </Button>
                    <Button
                      size="md"
                      variant="light"
                      className={
                        this.state.depth === 4
                          ? configStyles.selectedButton
                          : ""
                      }
                      onClick={(e) => {
                        this.setState({ depth: 4 });
                        this.props.handleDepth_Three(e, 4);
                      }}
                    >
                      4
                    </Button>
                    <Button
                      size="md"
                      variant="light"
                      className={
                        this.state.depth === -1
                          ? configStyles.selectedButton
                          : ""
                      }
                      onClick={(e) => {
                        this.setState({ depth: -1 });
                        this.props.handleDepth_Three(e, -1);
                      }}
                    >
                      Ultimate
                    </Button>
                  </Col>
                </Row>
                <div>
                  <>
                    {this.props.depth !== " " &&
                    this.props.gameBeginner != " " ? (
                      <Button
                        size="lg"
                        variant="light"
                        onClick={(e) => {
                          this.playAudio("audio-element-play");
                          this.props.update_Three("Go To Game");
                        }}
                      >
                        Let's Play!
                      </Button>
                    ) : (
                      <Button size="lg" variant="light" disabled>
                        Let's Play!
                      </Button>
                    )}
                  </>
                </div>
              </Container>
            </Container>
          </Container>
        </Container>
        <audio className="audio-element-play">
          <source src={play_game_sound}></source>
        </audio>
      </div>
    );
  }
}

const iconStyles = {
  color: "#FF7885",
};
