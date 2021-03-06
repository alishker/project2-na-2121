import React, { Component} from "react";
import styles from "../static/css/board.module.css";
import { Button, Container, Col, Row } from "react-bootstrap";
import axios from "axios";
import classNames from "classnames";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

const start_game_sound = require("../static/assets/sounds/start-game.mp3");
const place_icon_sound = require("../static/assets/sounds/place-icon.mp3");
let blinker;

export default class ThreeBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "],
      ],
      human_move_number: 0,
      startGameValue: false,
      whoPlaysFirstDialog: false,
      startGameButton: "Start Game",
      turn: this.props.gameBeginner,
      win: false,
      winner: " ",
      undoStack: [],
      symbol_stack: [],
      value_beginner: " ",
      symbol: {
        X: (
          <div style={{ textAlign: "center" }} className={styles.centerDiv}>
            <i className={"fas fa-user-astronaut " + styles.iconThree}></i>
          </div>
        ),
        O: (
          <div style={{ textAlign: "center" }}>
            <i
              className={
                "fas fa-robot " + styles.iconThree + " " + styles.iconAgent
              }
            ></i>
          </div>
        ),
        WA: (
          <div style={{ textAlign: "center" }}>
            <i
              className={
                "fas fa-robot fa-spin " +
                styles.iconThree +
                " " +
                styles.iconAgent
              }
            ></i>
          </div>
        ),
        WH: (
          <div style={{ textAlign: "center" }}>
            <i
              className={"fas fa-user-astronaut fa-spin " + styles.iconThree}
            ></i>
          </div>
        ),
      },
      darkMode: true,
      heading: "RED NINJA TIC TAC TOE",
      highlightButton: true,
    };
  }

  componentDidMount() {
    this.startBlinker();
  }

  startBlinker() {
    blinker = setInterval(() => {
      let newHighlight = !this.state.highlightButton;
      if (!this.state.startGameValue)
        this.setState({ highlightButton: newHighlight });
    }, 400);
  }

  stopBlinker() { // to stop the start button blinker when clicked
    clearInterval(blinker);
  }

  playAudio(audio_element) { //function for the audio effect of button clicks
    const audioEl = document.getElementsByClassName(audio_element)[0];
    audioEl.play();
  }

  checkTie(copy_board) { //To check if there happened a tie in the game
    let tie_flag = true;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (copy_board[i][j] === " ") {
          tie_flag = false;
        }
      }
    }
    if (tie_flag === true) {
      this.setState({
        win: true,
        winner: "TIE",
        heading: "IT'S A TIE!",
      });
      this.setScores("TIE");
    }
  }

  setScores(gameWinner) { //setting the scores of the human player
    let status = "WIN";
    if (gameWinner === "AGENT") status = "LOST";
    else if (gameWinner === "TIE") status = "TIE";
    let score = { game: "3*3", depth: this.props.depth, winner: status };
    let history = localStorage.getItem("scores");
    let a = [];
    if (history) a = JSON.parse(history) || [];

    a.push(score);
    localStorage.setItem("scores", JSON.stringify(a));
  }

  setWinner(gameWinner) { //to set the winner of the game
    let topHeading = "HOUSTON, YOU DID IT!  🎉";
    if (gameWinner === "AGENT") topHeading = "ROBOT'S WIN 🙁";

    this.setState({
      winner: gameWinner,
      heading: topHeading,
    });

    this.setScores(gameWinner);
  }

  changeMode(darkMode) { //to toggle the dark and night modes in the game
    this.setState({ darkMode: !darkMode });
  }

  check_win(copy_board) { //to check if there was a win of a player
    for (let i = 0; i < 3; i++) { // for each row
      if (
        copy_board[i][0] === copy_board[i][1] &&
        copy_board[i][0] === copy_board[i][2] &&
        copy_board[i][1] === copy_board[i][2] &&
        copy_board[i][0] !== " "
      ) {
        if (copy_board[i][0] === "O") {
          copy_board[i][0] = "WA";
          copy_board[i][1] = "WA";
          copy_board[i][2] = "WA";

          this.setWinner("AGENT");
        } else if (copy_board[i][0] === "X") {
          copy_board[i][0] = "WH";
          copy_board[i][1] = "WH";
          copy_board[i][2] = "WH";

          this.setWinner("HUMAN");
        }
        this.setState({
          win: true,
        });
      }
    }
    for (let i = 0; i < 3; i++) { //for each column
      if (
        copy_board[0][i] === copy_board[1][i] &&
        copy_board[0][i] === copy_board[2][i] &&
        copy_board[1][i] === copy_board[2][i] &&
        copy_board[0][i] !== " "
      ) {
        if (copy_board[0][i] === "O") {
          copy_board[0][i] = "WA";
          copy_board[1][i] = "WA";
          copy_board[2][i] = "WA";

          this.setWinner("AGENT");
        } else if (copy_board[0][i] === "X") {
          copy_board[0][i] = "WH";
          copy_board[1][i] = "WH";
          copy_board[2][i] = "WH";

          this.setWinner("HUMAN");
        }
        this.setState({
          win: true,
        });
      }
    }

    if ( // for left diagonal
      copy_board[0][0] === copy_board[1][1] &&
      copy_board[0][0] === copy_board[2][2] &&
      copy_board[1][1] === copy_board[2][2] &&
      copy_board[0][0] !== " "
    ) {
      if (copy_board[0][0] === "O") {
        copy_board[0][0] = "WA";
        copy_board[1][1] = "WA";
        copy_board[2][2] = "WA";

        this.setWinner("AGENT");
      } else if (copy_board[0][0] === "X") {
        copy_board[0][0] = "WH";
        copy_board[1][1] = "WH";
        copy_board[2][2] = "WH";

        this.setWinner("HUMAN");
      }
      this.setState({
        win: true,
      });
    }

    if ( //for right daigonal
      copy_board[0][2] === copy_board[1][1] &&
      copy_board[0][2] === copy_board[2][0] &&
      copy_board[1][1] === copy_board[2][0] &&
      copy_board[0][2] !== " "
    ) {
      if (copy_board[0][2] === "O") {
        copy_board[0][2] = "WA";
        copy_board[1][1] = "WA";
        copy_board[2][0] = "WA";

        this.setWinner("AGENT");
      } else if (copy_board[0][2] === "X") {
        copy_board[0][2] = "WH";
        copy_board[1][1] = "WH";
        copy_board[2][0] = "WH";

        this.setWinner("HUMAN");
      }
      this.setState({
        win: true,
      });
    }

    if (this.state.win === false) {
      this.checkTie(copy_board);
    }
  }

  sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  handleCellClick = (e, cell) => { // to place the icons of human and agent
    if (
      this.state.startGameValue &&
      this.state.win === false &&
      this.state.turn === "HUMAN"
    ) {
      let copy_board = this.state.board.slice();
      if (copy_board[Math.floor(cell / 3)][cell % 3] === " ") {
        this.playAudio("audio-element-icon");
        copy_board[Math.floor(cell / 3)][cell % 3] = "X";

        this.state.undoStack.push(cell);
        this.state.symbol_stack.push("H");

        this.setState({
          board: copy_board,
          turn: "AGENT",
          human_move_number: this.state.human_move_number + 1,
          heading: "AGENT'S TURN",
        });

        let copy_board2 = this.state.board.slice();
        this.check_win(copy_board2);

        this.sleep(1).then(() => {
          if (this.state.win === false) {
            axios
              .get("https://redninjas-tic-tac-toe.herokuapp.com/agent-turn", { //axios request with appropriate data of human's move
                params: {
                  gameBeginner: this.props.gameBeginner,
                  board: JSON.stringify(this.state.board),
                  depth: JSON.stringify(this.props.depth),
                },
              })
              .then((res) => {
                let copy_board = this.state.board.slice();

                copy_board[res.data.r][res.data.c] = "O"; 
                this.state.undoStack.push(3 * res.data.r + res.data.c);

                this.state.symbol_stack.push("A");

                this.sleep(2).then(() => {
                  if (this.state.startGameButton === "Reset Game") {
                    this.setState({
                      board: copy_board,
                      turn: "HUMAN",
                      heading: "YOUR TURN",
                    });
                    let copy_board3 = this.state.board.slice();
                    this.check_win(copy_board3);

                    if (this.state.win === true) {
                      this.sleep(1).then(() => {
                        this.props.update_Win_Three("three", this.state.winner);
                      });
                    }
                  } else {
                    this.setState({
                      board: [
                        [" ", " ", " "],
                        [" ", " ", " "],
                        [" ", " ", " "],
                      ],
                    });
                  }
                });
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            this.sleep(2).then(() => {
              this.props.update_Win_Three("three", this.state.winner);
            });
          }
        });
      }
    }
  };

  handleStartGame = (e, startGame) => { // to start and reset the game
    this.playAudio("audio-element-start");
    if (this.props.gameBeginner === "AGENT") {
      this.setState({
        value_beginner: 0,
      });
    } else {
      this.setState({
        value_beginner: 1,
      });
    }

    if (startGame === "Start Game") {
      let topHeading = "YOUR TURN";
      if (this.props.gameBeginner === "AGENT") topHeading = "AGENT'S TURN";

      this.setState({
        board: [
          [" ", " ", " "],
          [" ", " ", " "],
          [" ", " ", " "],
        ],
        startGameButton: "Reset Game",
        startGameValue: true,
        heading: topHeading,
        highlightButton: false,
      });
      this.stopBlinker();

      if (this.props.gameBeginner === "AGENT") {
        axios
          .get("https://redninjas-tic-tac-toe.herokuapp.com/agent-turn", {
            params: {
              gameBeginner: this.props.gameBeginner,
              board: JSON.stringify(this.state.board),
              depth: JSON.stringify(this.props.depth),
            },
          }) 
          .then((res) => {
            let copy_board = this.state.board.slice();

            copy_board[res.data.r][res.data.c] = "O";
            this.state.undoStack.push(3 * res.data.r + res.data.c);
            this.state.symbol_stack.push("A");
            if (this.state.startGameButton === "Reset Game") {
              this.setState({
                board: copy_board,
                turn: "HUMAN",
                heading: "YOUR TURN",
              });
            } else {
              this.setState({
                board: [
                  [" ", " ", " "],
                  [" ", " ", " "],
                  [" ", " ", " "],
                ],
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else if (startGame === "Reset Game" && !this.state.win) {
      this.setState({
        board: [
          [" ", " ", " "],
          [" ", " ", " "],
          [" ", " ", " "],
        ],
        startGameValue: false,
        whoPlaysFirstDialog: false,
        startGameButton: "Start Game",
        win: false,
        winner: " ",
        depth: this.props.depth,
        undoStack: [],
        symbol_stack: [],
        turn: this.props.gameBeginner,
      });

      this.startBlinker();

      if (this.props.gameBeginner === "AGENT") {
        this.setState({
          value_beginner: 0,
        });
      } else {
        this.setState({
          value_beginner: 1,
        });
      }
    }
  };

  handleUndoFeature = (e, index, cell) => { // to undo the moves of the human player
    let copy_board = this.state.board.slice();
    let copy_undoStack = this.state.undoStack.slice();
    let copy_symbol_stack = this.state.symbol_stack.slice();

    let totalOfUndoButtons = copy_undoStack.length;
    let buttonsToErase = totalOfUndoButtons - (index + 1);

    for (let i = 0; i <= buttonsToErase; i++) {
      copy_board[Math.floor(copy_undoStack[copy_undoStack.length - 1] / 3)][
        copy_undoStack[copy_undoStack.length - 1] % 3
      ] = " ";
      copy_undoStack.pop();
    }

    for (let i = 0; i <= buttonsToErase; i++) {
      copy_symbol_stack.pop();
    }

    this.setState({
      board: copy_board,
      undoStack: copy_undoStack,
      symbol_stack: copy_symbol_stack,
      turn: "HUMAN",
      heading: "YOUR TURN",
    });
  };

  render() {
    return (
      <div>
        <div
          className={classNames(styles.landingBody, {
            [styles.whiteBg]: !this.state.darkMode,
          })}
        >
          <div style={{ margin: "auto", width: "600px", maxWidth: "90%" }}>
            <Container
              className={classNames(styles.heading, styles.board, {
                [styles.lightHeading]: !this.state.darkMode,
              })}
            >
              <Row>
                <Col>
                  {" "}
                  <h1 className={styles.title}>{this.state.heading}</h1>
                </Col>
              </Row>
            </Container>

            <Container className={styles.board}>
              <Container fluid="true">
                {this.state.board.map((row, i) => (
                  <Row>
                    {row.map((cell, j) => (
                      <Col
                        md
                        className={classNames(styles.cellThree, {
                          [styles.greyCell]: !this.state.darkMode,
                        })}
                        onClick={(e) => this.handleCellClick(e, 3 * i + j)}
                      >
                        {this.state.symbol[this.state.board[i][j]]}
                      </Col>
                    ))}
                  </Row>
                ))}
              </Container>
            </Container>

            <Container
              className={classNames(styles.boardInfo, styles.board, {
                [styles.lightHeading]: !this.state.darkMode,
              })}
            >
              <Row style={{ padding: "1%" }}>
                <Col xs={4} className={styles.center}>
                  Level: {this.props.depth === -1 ? 5 : this.props.depth}
                </Col>
                <Col className={styles.center}>
                  <i class="fa fa-sun" aria-hidden="true"></i>
                </Col>
                <Col className={styles.center}>
                  <span>
                    {this.state.darkMode ? (
                      <i
                        class="fa fa-2x fa-toggle-on"
                        style={{ cursor: "pointer" }}
                        onClick={() => this.changeMode(this.state.darkMode)}
                        aria-hidden="true"
                      ></i>
                    ) : (
                      <i
                        class="fa fa-2x fa-toggle-off"
                        style={{ cursor: "pointer" }}
                        onClick={() => this.changeMode(this.state.darkMode)}
                        aria-hidden="true"
                      ></i>
                    )}
                  </span>
                </Col>
                <Col className={styles.center}>
                  <i class="fa fa-moon" aria-hidden="true"></i>
                </Col>
                <Col xs={4}>
                  <Button
                    variant="dark"
                    className={classNames(styles.button, {
                      [styles.lightHeading]: !this.state.darkMode,
                      [styles.highlightButton]: this.state.highlightButton,
                    })}
                    onClick={(e) =>
                      this.handleStartGame(e, this.state.startGameButton)
                    }
                    disabled={this.state.win}
                  >
                    {this.state.startGameButton}
                  </Button>
                </Col>
              </Row>
            </Container>
            {this.state.win === false ? (
              <Container
                fluid="true"
                className={classNames(styles.undo, {
                  [styles.lightUndo]: !this.state.darkMode,
                })}
              >
                {this.state.symbol_stack.length > 1 ||
                this.state.symbol_stack[0] === "H"
                  ? "Reverse to "
                  : ""}
                {this.state.symbol_stack.map((cell, i) =>
                  this.state.symbol_stack[i] === "H" ? (
                    <Button
                      variant={this.state.darkMode ? "dark" : "light"}
                      onClick={(e) => this.handleUndoFeature(e, i, cell)}
                    >
                      {Math.ceil((i + 1) / 2) +
                        ((i + 1) % 2) -
                        this.state.value_beginner}
                    </Button>
                  ) : (
                    <></>
                  )
                )}
              </Container>
            ) : (
              " "
            )}

            <audio className="audio-element-start">
              <source src={start_game_sound}></source>
            </audio>

            <audio className="audio-element-icon">
              <source src={place_icon_sound}></source>
            </audio>

          </div>
        </div>
      </div>
    );
  }
}

const heading = {
  display: "inline-block",
  textAlign: "center",
  width: "80%",
  lineHeight: 1.5,
};
