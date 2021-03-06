import React, { Component} from "react";
import styles from "../static/css/board.module.css";
import { Button, Container, Col, Row } from "react-bootstrap";
import axios from "axios";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import classNames from "classnames";
import Message from "./Message.js";

const start_game_sound = require("../static/assets/sounds/start-game.mp3");

const place_icon_sound = require("../static/assets/sounds/place-icon.mp3");

let blinker;
let humanTurn = "YOUR TURN";
let agentTurn = "AGENT'S TURN";
let winMessage = "YOU WON! 🎉";
let loseMessage = "YOU LOST 🙁";
let drawMessage = "IT'S A TIE!";

export default class NineBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show_9x9_BoardComponent: this.props.show_9x9_BoardComponent,
      startGameButton: "Start Game",
      turn: this.props.gameBeginner,
      startGameValue: false,
      ultimateWin: false,
      winner: " ",
      messageForHint: " ",
      messageForError: false,
      rowToPlace: " ",
      columnToPlace: " ",
      agentOuterRow: " ",
      agentOuterColumn: " ",
      agentInnerRow: " ",
      agentInnerColumn: " ",
      ultimateWinBoard: [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "],
      ],
      bigboard: [
        [
          [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
          ],

          [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
          ],

          [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
          ],
        ],

        [
          [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
          ],

          [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
          ],

          [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
          ],
        ],

        [
          [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
          ],

          [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
          ],

          [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
          ],
        ],
      ],

      symbol: {
        X: (
          <div style={{ textAlign: "center" }}>
            <i className={"fas fa-times amber-text " + styles.iconNine}></i>

          </div>
        ),
        O: (
          <div style={{ textAlign: "center" }}>
            <i className={"far fa-circle pink-text " + styles.iconNine}></i>

          </div>
        ),
        WA: (
          <div style={{ textAlign: "center" }}>
            <i
              className={"fas fa-laugh-wink amber-text " + styles.iconNine}
            ></i>

          </div>
        ),
        WH: (
          <div style={{ textAlign: "center" }}>
            <i className={"far fa-laugh-wink pink-text " + styles.iconNine}></i>

          </div>
        ),
        LA: (
          <div style={{ textAlign: "center" }}>
            <i className={"fas fa-sad-cry amber-text " + styles.iconNine}></i>

          </div>
        ),
        LH: (
          <div style={{ textAlign: "center" }}>
            <i className={"far fa-sad-cry pink-text " + styles.iconNine}></i>

          </div>
        ),
      },
      darkMode: true,
      heading: "RED NINJA TIC TAC TOE",
      highlightButton: false,
    };
  }

  componentDidMount() {
    this.startBlinker();
  }

  playAudio(audio_element) { //for the sound effect for button clicks
    const audioEl = document.getElementsByClassName(audio_element)[0];
    audioEl.play();
  }

  startBlinker() { //start the start button blinker
    blinker = setInterval(() => {
      let newHighlight = !this.state.highlightButton;
      if (!this.state.startGameValue)
        this.setState({ highlightButton: newHighlight });
    }, 400);
  }

  stopBlinker() { //stop the blinker button when clicked
    clearInterval(blinker);
  }

  changeMode(darkMode) { //toggle the dark and light mode
    this.setState({ darkMode: !darkMode });
  }

  setScores(gameWinner) { //setting the scores of the human player
    let status = "WIN";
    if (gameWinner == "AGENT") status = "LOST";
    else if (gameWinner == "TIE") status = "TIE";
    let score = { game: "9*9", depth: "ULTIMATE", winner: status };
    let history = localStorage.getItem("scores");
    let a = [];
    if (history) a = JSON.parse(history) || [];

    a.push(score);
    localStorage.setItem("scores", JSON.stringify(a));
  }

  checkTie(bigBoard) { //to check if there is a TIE in a localBoard of the 9*9 game
    let outer_row, outer_column, inner_row, inner_column;
    for (outer_row = 0; outer_row < 3; outer_row++) {
      for (outer_column = 0; outer_column < 3; outer_column++) {
        let tie_flag = true;
        for (inner_row = 0; inner_row < 3; inner_row++) {
          for (inner_column = 0; inner_column < 3; inner_column++) {
            if (
              bigBoard[outer_row][outer_column][inner_row][inner_column] ===
                " " ||
              this.state.ultimateWinBoard[outer_row][outer_column] !== " "
            ) {
              tie_flag = false;
            }
          }
        }
        if (tie_flag === true) {
          let ultimateBoard = this.state.ultimateWinBoard.slice();

          ultimateBoard[outer_row][outer_column] = "T";

          this.setState({
            ultimateWinBoard: ultimateBoard,
          });
        }
      }
    }
  }

  alterBigBoardRow(//to change the icons of the winner and loser in row
    winner_symbol,
    winner_status,
    loser_symbol,
    loser_status,
    win_row
  ) {
    let copy_bigBoard = this.state.bigboard.slice();
    for (let outer_row = 0; outer_row < 3; outer_row++) {
      for (let outer_column = 0; outer_column < 3; outer_column++) {
        for (let inner_row = 0; inner_row < 3; inner_row++) {
          for (let inner_column = 0; inner_column < 3; inner_column++) {
            if (outer_row === win_row) {
              copy_bigBoard[outer_row][outer_column][inner_row][
                inner_column
              ] = winner_status;
            } else {
              if (
                copy_bigBoard[outer_row][outer_column][inner_row][
                  inner_column
                ] === winner_symbol
              ) {
                copy_bigBoard[outer_row][outer_column][inner_row][
                  inner_column
                ] = winner_status;
              } else if (
                copy_bigBoard[outer_row][outer_column][inner_row][
                  inner_column
                ] === loser_symbol
              ) {
                copy_bigBoard[outer_row][outer_column][inner_row][
                  inner_column
                ] = loser_status;
              }
            }
          }
        }
      }
    }

    this.setState({
      bigboard: copy_bigBoard,
    });
  }

  alterBigBoardColumn( //to change the icons of the winner and loser in column
    winner_symbol,
    winner_status,
    loser_symbol,
    loser_status,
    win_column
  ) {
    let copy_bigBoard = this.state.bigboard.slice();

    for (let outer_row = 0; outer_row < 3; outer_row++) {
      for (let outer_column = 0; outer_column < 3; outer_column++) {
        for (let inner_row = 0; inner_row < 3; inner_row++) {
          for (let inner_column = 0; inner_column < 3; inner_column++) {
            if (outer_column === win_column) {
              copy_bigBoard[outer_row][outer_column][inner_row][
                inner_column
              ] = winner_status;
            } else {
              if (
                copy_bigBoard[outer_row][outer_column][inner_row][
                  inner_column
                ] === winner_symbol
              ) {
                copy_bigBoard[outer_row][outer_column][inner_row][
                  inner_column
                ] = winner_status;
              } else if (
                copy_bigBoard[outer_row][outer_column][inner_row][
                  inner_column
                ] === loser_symbol
              ) {
                copy_bigBoard[outer_row][outer_column][inner_row][
                  inner_column
                ] = loser_status;
              }
            }
          }
        }
      }
    }

    this.setState({
      bigboard: copy_bigBoard,
    });
  }

  alterBigBoardLeftDiagonal( //to change the icons of the winner and loser in left diagonal
    winner_symbol,
    winner_status,
    loser_symbol,
    loser_status
  ) {
    let copy_bigBoard = this.state.bigboard.slice();

    for (let outer_row = 0; outer_row < 3; outer_row++) {
      for (let outer_column = 0; outer_column < 3; outer_column++) {
        for (let inner_row = 0; inner_row < 3; inner_row++) {
          for (let inner_column = 0; inner_column < 3; inner_column++) {
            if (
              (outer_row === 0 && outer_column === 0) ||
              (outer_row === 1 && outer_column === 1) ||
              (outer_row === 2 && outer_column === 2)
            ) {
              copy_bigBoard[outer_row][outer_column][inner_row][
                inner_column
              ] = winner_status;
            } else {
              if (
                copy_bigBoard[outer_row][outer_column][inner_row][
                  inner_column
                ] === winner_symbol
              ) {
                copy_bigBoard[outer_row][outer_column][inner_row][
                  inner_column
                ] = winner_status;
              } else if (
                copy_bigBoard[outer_row][outer_column][inner_row][
                  inner_column
                ] === loser_symbol
              ) {
                copy_bigBoard[outer_row][outer_column][inner_row][
                  inner_column
                ] = loser_status;
              }
            }
          }
        }
      }
    }
    this.setState({
      bigboard: copy_bigBoard,
    });
  }

  alterBigBoardRightDiagonal( //to change the icons of the winner and loser in right diagonal
    winner_symbol,
    winner_status,
    loser_symbol,
    loser_status
  ) {
    let copy_bigBoard = this.state.bigboard.slice();
    for (let outer_row = 0; outer_row < 3; outer_row++) {
      for (let outer_column = 0; outer_column < 3; outer_column++) {
        for (let inner_row = 0; inner_row < 3; inner_row++) {
          for (let inner_column = 0; inner_column < 3; inner_column++) {
            if (
              (outer_row === 0 && outer_column === 2) ||
              (outer_row === 1 && outer_column === 1) ||
              (outer_row === 2 && outer_column === 0)
            ) {
              copy_bigBoard[outer_row][outer_column][inner_row][
                inner_column
              ] = winner_status;
            } else {
              if (
                copy_bigBoard[outer_row][outer_column][inner_row][
                  inner_column
                ] === winner_symbol
              ) {
                copy_bigBoard[outer_row][outer_column][inner_row][
                  inner_column
                ] = winner_status;
              } else if (
                copy_bigBoard[outer_row][outer_column][inner_row][
                  inner_column
                ] === loser_symbol
              ) {
                copy_bigBoard[outer_row][outer_column][inner_row][
                  inner_column
                ] = loser_status;
              }
            }
          }
        }
      }
    }
    this.setState({
      bigboard: copy_bigBoard,
    });
  }

  setWinner(gameWinner) {
    let topHeading = winMessage;
    if (gameWinner == "AGENT") topHeading = loseMessage;

    this.setScores(gameWinner);
    this.setState({
      winner: gameWinner,
      heading: topHeading,
    });
  }

  checkFinalTie() { //to check if there is a TIE condition in the global board (entire game)
    let final_tie_flag = true;
    for (let outer_row = 0; outer_row < 3; outer_row++) {
      for (let outer_column = 0; outer_column < 3; outer_column++) {
        for (let inner_row = 0; inner_row < 3; inner_row++) {
          for (let inner_column = 0; inner_column < 3; inner_column++) {
            if (
              this.state.bigboard[outer_row][outer_column][inner_row][
                inner_column
              ] === " "
            ) {
              final_tie_flag = false;
            }
          }
        }
      }
    }

    if (final_tie_flag === true) {
      this.setState({
        winner: "TIE",
        ultimateWin: true,
        heading: drawMessage,
      });

      this.setScores("TIE");
    }
  }

  check_ultimate_win(copy_board) { //to check if there is a win in the global board
    if (this.state.ultimateWin === false) { //row
      for (let i = 0; i < 3; i++) {
        //for row
        if (
          copy_board[i][0] === copy_board[i][1] &&
          copy_board[i][0] === copy_board[i][2] &&
          copy_board[i][1] === copy_board[i][2] &&
          copy_board[i][0] !== " "
        ) {
          if (copy_board[i][0] === "O") {
            this.alterBigBoardRow("O", "WH", "X", "LA", i);
            this.setWinner("HUMAN");
          } else if (copy_board[i][0] === "X") {
            this.alterBigBoardRow("X", "WA", "O", "LH", i);
            this.setWinner("AGENT");
          }
          this.setState({
            ultimateWin: true,
            ultimateWinBoard: copy_board,
          });
        }
      }
    }

    if (this.state.ultimateWin === false) { //column
      for (let i = 0; i < 3; i++) {
        // for column
        if (
          copy_board[0][i] === copy_board[1][i] &&
          copy_board[0][i] === copy_board[2][i] &&
          copy_board[1][i] === copy_board[2][i] &&
          copy_board[0][i] !== " "
        ) {
          if (copy_board[0][i] === "O") {
            this.alterBigBoardColumn("O", "WH", "X", "LA", i);
            this.setWinner("HUMAN");
          } else if (copy_board[0][i] === "X") {
            this.alterBigBoardColumn("X", "WA", "O", "LH", i);
            this.setWinner("AGENT");
          }
          this.setState({
            ultimateWin: true,
            ultimateWinBoard: copy_board,
          });
        }
      }
    }

    if (this.state.ultimateWin === false) { //left diagonal
      if (
        copy_board[0][0] === copy_board[1][1] &&
        copy_board[0][0] === copy_board[2][2] &&
        copy_board[1][1] === copy_board[2][2] &&
        copy_board[0][0] !== " "
      ) {
        if (copy_board[0][0] === "O") {
          this.alterBigBoardLeftDiagonal("O", "WH", "X", "LA");
          this.setWinner("HUMAN");
        } else if (copy_board[0][0] === "X") {
          this.alterBigBoardLeftDiagonal("X", "WA", "O", "LH");
          this.setWinner("AGENT");
        }
        this.setState({
          ultimateWin: true,
          ultimateWinBoard: copy_board,
        });
      }
    }

    if (this.state.ultimateWin === false) { //right diagonal
      if (
        copy_board[0][2] === copy_board[1][1] &&
        copy_board[0][2] === copy_board[2][0] &&
        copy_board[1][1] === copy_board[2][0] &&
        copy_board[0][2] !== " "
      ) {
        if (copy_board[0][2] === "O") {
          this.alterBigBoardRightDiagonal("O", "WH", "X", "LA");
          this.setWinner("HUMAN");
        } else if (copy_board[0][2] === "X") {
          this.alterBigBoardRightDiagonal("X", "WA", "O", "LH");
          this.setWinner("AGENT");
        }
        this.setState({
          ultimateWin: true,
          ultimateWinBoard: copy_board,
        });
      }
    }
    if (this.state.ultimateWin === false) {
      this.checkFinalTie();
    }
  }

  place_partial(bigBoard, outer_row, outer_column, symbol) { //to put the winning symbol in local boards
    for (let inner_row = 0; inner_row < 3; inner_row++) {
      for (let inner_column = 0; inner_column < 3; inner_column++) {
        bigBoard[outer_row][outer_column][inner_row][inner_column] = symbol;
      }
    }

    let copyUltimateWinBoard_1 = this.state.ultimateWinBoard.slice();
    copyUltimateWinBoard_1[outer_row][outer_column] = symbol;

    this.setState({
      bigboard: bigBoard,
      ultimateWinBoard: copyUltimateWinBoard_1,
    });

    let copyUltimateWinBoard_2 = this.state.ultimateWinBoard.slice();
    this.check_ultimate_win(copyUltimateWinBoard_2);
  }

  checkPartialWin(bigBoard) { //to check if there is a win by any player in the local boards
    for (let outer_row = 0; outer_row < 3; outer_row++) { //for rows
      for (let outer_column = 0; outer_column < 3; outer_column++) {
        for (let i = 0; i < 3; i++) {
          if (
            bigBoard[outer_row][outer_column][i][0] ===
              bigBoard[outer_row][outer_column][i][1] &&
            bigBoard[outer_row][outer_column][i][1] ===
              bigBoard[outer_row][outer_column][i][2] &&
            bigBoard[outer_row][outer_column][i][0] ===
              bigBoard[outer_row][outer_column][i][2] &&
            bigBoard[outer_row][outer_column][i][0] !== " "
          ) {
            if (bigBoard[outer_row][outer_column][i][0] === "O") {
              this.place_partial(bigBoard, outer_row, outer_column, "O");
            } else if (bigBoard[outer_row][outer_column][i][0] === "X") {
              this.place_partial(bigBoard, outer_row, outer_column, "X");
            }
          }
        }
      }
    }

    for (let outer_row = 0; outer_row < 3; outer_row++) { //for columns
      for (let outer_column = 0; outer_column < 3; outer_column++) {
        for (let i = 0; i < 3; i++) {
          if (
            bigBoard[outer_row][outer_column][0][i] ===
              bigBoard[outer_row][outer_column][1][i] &&
            bigBoard[outer_row][outer_column][0][i] ===
              bigBoard[outer_row][outer_column][2][i] &&
            bigBoard[outer_row][outer_column][1][i] ===
              bigBoard[outer_row][outer_column][2][i] &&
            bigBoard[outer_row][outer_column][0][i] !== " "
          ) {
            if (bigBoard[outer_row][outer_column][0][i] === "O") {
              this.place_partial(bigBoard, outer_row, outer_column, "O");
            } else if (bigBoard[outer_row][outer_column][0][i] === "X") {
              this.place_partial(bigBoard, outer_row, outer_column, "X");
            }
          }
        }
      }
    }

    for (let outer_row = 0; outer_row < 3; outer_row++) { //for left diagonal
      for (let outer_column = 0; outer_column < 3; outer_column++) {
        if (
          bigBoard[outer_row][outer_column][0][0] ===
            bigBoard[outer_row][outer_column][1][1] &&
          bigBoard[outer_row][outer_column][0][0] ===
            bigBoard[outer_row][outer_column][2][2] &&
          bigBoard[outer_row][outer_column][1][1] ===
            bigBoard[outer_row][outer_column][2][2] &&
          bigBoard[outer_row][outer_column][0][0] !== " "
        ) {
          if (bigBoard[outer_row][outer_column][0][0] === "O") {
            this.place_partial(bigBoard, outer_row, outer_column, "O");
          } else if (bigBoard[outer_row][outer_column][0][0] === "X") {
            this.place_partial(bigBoard, outer_row, outer_column, "X");
          }
        }
      }
    }

    for (let outer_row = 0; outer_row < 3; outer_row++) { //for right diagonal
      for (let outer_column = 0; outer_column < 3; outer_column++) {
        if (
          bigBoard[outer_row][outer_column][0][2] ===
            bigBoard[outer_row][outer_column][1][1] &&
          bigBoard[outer_row][outer_column][0][2] ===
            bigBoard[outer_row][outer_column][2][0] &&
          bigBoard[outer_row][outer_column][1][1] ===
            bigBoard[outer_row][outer_column][2][0] &&
          bigBoard[outer_row][outer_column][0][2] !== " "
        ) {
          if (bigBoard[outer_row][outer_column][0][2] === "O") {
            this.place_partial(bigBoard, outer_row, outer_column, "O");
          } else if (bigBoard[outer_row][outer_column][0][2] === "X") {
            this.place_partial(bigBoard, outer_row, outer_column, "X");
          }
        }
      }
    }

    this.checkTie(bigBoard);
  }

  checkValidityOfMove(outer_row, outer_column) {
    if (
      this.state.rowToPlace !== " " &&
      this.state.ultimateWinBoard[this.state.rowToPlace][
        this.state.columnToPlace
      ] === " "
    ) {
      if (outer_row !== this.state.rowToPlace) return false;
      else if (outer_column !== this.state.columnToPlace) return false;
      else if (
        outer_row === this.state.rowToPlace &&
        outer_column === this.state.columnToPlace
      )
        return true;
    } else {
      return true;
    }
  }

  resetBoard() { //to reset the board back to the original state when reset happens
    this.setState({
      bigboard: [
        [
          [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
          ],

          [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
          ],

          [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
          ],
        ],

        [
          [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
          ],

          [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
          ],

          [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
          ],
        ],

        [
          [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
          ],

          [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
          ],

          [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "],
          ],
        ],
      ],
    });
  }

  hintPlacer() { // function to handle the display of hint boxes for the human player
    if (
      this.state.ultimateWinBoard[this.state.rowToPlace][
        this.state.columnToPlace
      ] === " "
    ) {
      this.setState({
        messageForHint: "Place in the cell",
      });
    } else {
      this.setState({
        messageForHint: "Place anywhere",
      });
    }
  }

  sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  handleCellClick = (e, outerRow, outerColumn, innerRow, innerColumn) => { //to place the human and agent's symbols
    if (
      this.state.startGameValue === true &&
      this.state.ultimateWin === false &&
      this.state.turn === "HUMAN"
    ) {
      let copy_bigBoard1 = this.state.bigboard.slice();
      if (
        copy_bigBoard1[outerRow][outerColumn][innerRow][innerColumn] === " "
      ) {
        if (this.checkValidityOfMove(outerRow, outerColumn) === true) {
          this.setState({
            messageForError: false,
          });
          this.playAudio("audio-element-icon");

          copy_bigBoard1[outerRow][outerColumn][innerRow][innerColumn] = "O";

          this.setState({
            bigboard: copy_bigBoard1,
            turn: "AGENT",
            heading: agentTurn,
          });

          let copy_bigBoard2 = this.state.bigboard.slice();
          this.checkPartialWin(copy_bigBoard2);

          this.sleep(0.5).then(() => {
            if (this.state.ultimateWin === false) {
              axios
                .get(
                  "https://redninjas-tic-tac-toe.herokuapp.com/agent-turn-ultimate", //axios request to the backend with appropriate data of human's move
                  {
                    params: {
                      board: JSON.stringify(this.state.bigboard),
                      checkboard: JSON.stringify(this.state.ultimateWinBoard),
                      previous_move: JSON.stringify([
                        outerRow,
                        outerColumn,
                        innerRow,
                        innerColumn,
                      ]),
                    },
                  }
                )
                .then((res) => {
                  let copy_board1 = this.state.bigboard.slice();
                  copy_board1[res.data["agent-move"][0]][
                    res.data["agent-move"][1]
                  ][res.data["agent-move"][2]][res.data["agent-move"][3]] = "X";
                  if (this.state.startGameButton === "Reset Game") {
                    this.setState({
                      bigboard: copy_board1,
                      rowToPlace: res.data["agent-move"][2],
                      columnToPlace: res.data["agent-move"][3],
                      turn: "HUMAN",
                      heading: humanTurn,
                      agentOuterRow: res.data["agent-move"][0],
                      agentOuterColumn: res.data["agent-move"][1],
                      agentInnerRow: res.data["agent-move"][2],
                      agentInnerColumn: res.data["agent-move"][3],
                    });
                    let copy_bigBoard2 = this.state.bigboard.slice();
                    this.checkPartialWin(copy_bigBoard2);

                    this.hintPlacer();
                    this.sleep(0.5).then(() => {
                      if (this.state.ultimateWin === true) {
                        this.sleep(5).then(() => {
                          this.props.update_Win_Nine("nine", this.state.winner);
                        });
                      }
                    });
                  } else {
                    this.resetBoard();
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              this.sleep(5).then(() => {
                this.props.update_Win_Nine("nine", this.state.winner);
              });
            }
          });
        } else {
          this.setState({
            messageForError: true,
          });
        }
      } else {
        this.setState({
          messageForError: true,
        });
      }
    }
  };

  handleStartGame = (e, startGame) => { //function to start abd reset the game
    this.playAudio("audio-element-start");

    if (startGame === "Start Game") {
      this.resetBoard();
      let topHeading = humanTurn;
      if (this.props.gameBeginner == "AGENT") topHeading = agentTurn;
      if (this.props.gameBeginner === "HUMAN") {
        this.setState({
          messageForHint: "Place Anywhere",
        });
      }
      this.setState({
        startGameButton: "Reset Game",
        startGameValue: true,
        highlightButton: false,
        turn: this.props.gameBeginner,
        heading: topHeading,
      });

      if (this.state.turn === "AGENT") {
        axios
          .get(
            "https://redninjas-tic-tac-toe.herokuapp.com/agent-turn-ultimate", //request with appropriate data of human's move to be sent to the backend
            {
              params: {
                board: JSON.stringify(this.state.bigboard),
                checkboard: JSON.stringify(this.state.ultimateWinBoard),
                previous_move: JSON.stringify([-1, -1, -1, -1]),
              },
            }
          )
          .then((res) => {
            let copy_board1 = this.state.bigboard.slice();
            copy_board1[res.data["agent-move"][0]][res.data["agent-move"][1]][
              res.data["agent-move"][2]
            ][res.data["agent-move"][3]] = "X";

            if (this.state.startGameButton === "Reset Game") {
              this.setState({
                bigboard: copy_board1,
                rowToPlace: res.data["agent-move"][2],
                columnToPlace: res.data["agent-move"][3],
                turn: "HUMAN",
                heading: humanTurn,
                agentOuterRow: res.data["agent-move"][0],
                agentOuterColumn: res.data["agent-move"][1],
                agentInnerRow: res.data["agent-move"][2],
                agentInnerColumn: res.data["agent-move"][3],
              });
              let copy_bigBoard2 = this.state.bigboard.slice();
              this.checkPartialWin(copy_bigBoard2);
              this.hintPlacer();
            } else {
              this.resetBoard();
            }
          });
      }
    } else if (startGame === "Reset Game" && !this.state.ultimateWin) {
      let copy_board = this.state.bigboard.slice();

      for (let outer_row = 0; outer_row < 3; outer_row++) {
        for (let outer_column = 0; outer_column < 3; outer_column++) {
          for (let inner_row = 0; inner_row < 3; inner_row++) {
            for (let inner_column = 0; inner_column < 3; inner_column++) {
              copy_board[outer_row][outer_column][inner_row][inner_column] =
                " ";
            }
          }
        }
      }

      this.setState({
        bigboard: copy_board,
        gameBeginner: this.props.gameBeginner,
        startGameButton: "Start Game",
        startGameValue: false,
        ultimateWin: false,
        winner: " ",
        rowToPlace: " ",
        columnToPlace: " ",
        ultimateWinBoard: [
          [" ", " ", " "],
          [" ", " ", " "],
          [" ", " ", " "],
        ],
        agentOuterRow: " ",
        agentOuterColumn: " ",
        agentInnerRow: " ",
        agentInnerColumn: " ",
        turn: this.props.gameBeginner,
        heading: "RED NINJA TIC TAC TOE",
      });

      if (this.props.gameBeginner === "HUMAN") {
        this.setState({
          messageForHint: "Place Anywhere",
        });
      }
    }
  };

  checkDarkHighlight() {}

  render() {
    return (
      <div
        className={classNames(styles.landingBody, {
          [styles.whiteBg]: !this.state.darkMode,
        })}
      >
        <div style={{ margin: "auto", width: "700px", maxWidth: "90%" }}>
          <Container
            className={classNames(
              styles.heading,
              styles.nineHeading,
              styles.board,
              { [styles.lightHeading]: !this.state.darkMode }
            )}
          >
            <Row>
              <Col>
                <h1 className={styles.title}>
                  {this.state.heading}{" "}
                  {this.state.turn === "HUMAN" || !this.state.startGameValue ? (
                    ""
                  ) : (
                    <i
                      className={
                        "fas fa-spinner fa-1x fa-pulse ml-2 " +
                        styles.nineSpinner
                      }
                    ></i>
                  )}
                </h1>
              </Col>
            </Row>
          </Container>
          <Container className={styles.board}>
            <Container fluid="true">
              {this.state.bigboard.map((row, outerRow) => (
                <Row>
                  {row.map((column, outerColumn) => (
                    <Col
                      md
                      style={cellStyle1}
                      className={{ [styles.greyCell]: !this.state.darkMode }}
                    >
                      {this.state.bigboard.map((inner_row, innerRow) => (
                        <Row style={{ maxWidth: "100%", margin: "0 auto" }}>
                          {inner_row.map((inner_column, innerColumn) => (
                            <Col
                              md
                              style={
                                (outerRow === this.state.rowToPlace &&
                                  outerColumn === this.state.columnToPlace &&
                                  this.state.rowToPlace !== " " &&
                                  this.state.columnToPlace !== " " &&
                                  this.state.ultimateWin === false &&
                                  this.state.darkMode &&
                                  this.state.messageForHint ===
                                    "Place in the cell") ||
                                (outerRow == this.state.agentOuterRow &&
                                  innerRow == this.state.agentInnerRow &&
                                  outerColumn == this.state.agentOuterColumn &&
                                  innerColumn == this.state.agentInnerColumn &&
                                  this.state.agentOuterRow !== " " &&
                                  this.state.darkMode &&
                                  !this.state.ultimateWin)
                                  ? cellStyle3
                                  : cellStyle2
                              }
                              className={classNames(styles.cellNine, {
                                [styles.greyCell]: !this.state.darkMode,
                                [styles.highlighted]:
                                  (outerRow === this.state.rowToPlace &&
                                    outerColumn === this.state.columnToPlace &&
                                    this.state.rowToPlace !== " " &&
                                    this.state.columnToPlace !== " " &&
                                    this.state.ultimateWin === false &&
                                    !this.state.darkMode &&
                                    this.state.messageForHint ===
                                      "Place in the cell") ||
                                  (outerRow == this.state.agentOuterRow &&
                                    innerRow == this.state.agentInnerRow &&
                                    outerColumn ==
                                      this.state.agentOuterColumn &&
                                    innerColumn ==
                                      this.state.agentInnerColumn &&
                                    this.state.agentOuterRow !== " " &&
                                    !this.state.darkMode &&
                                    !this.state.ultimateWin),
                              })}
                              onClick={(e) =>
                                this.handleCellClick(
                                  e,
                                  outerRow,
                                  outerColumn,
                                  innerRow,
                                  innerColumn
                                )
                              }
                            >
                              {
                                <div style={{ textAlign: "center" }}>
                                  {
                                    this.state.symbol[
                                      this.state.bigboard[outerRow][
                                        outerColumn
                                      ][innerRow][innerColumn]
                                    ]
                                  }
                                </div>
                              }
                            </Col>
                          ))}
                        </Row>
                      ))}
                    </Col>
                  ))}
                </Row>
              ))}
            </Container>
          </Container>

          <Container
            styles={{ marginTop: "1% !important" }}
            className={classNames(
              styles.boardInfo,
              styles.board,
              styles.nineBoardInfo,
              { [styles.lightHeading]: !this.state.darkMode }
            )}
          >
            <Row style={{ padding: "1%" }}>
              <Col
                style={{ cursor: "pointer", fontSize: "1.5rem" }}
                className={styles.center}
                xs={4}
              >
                <i
                  onClick={() => window.open("/rules", "_blank")}
                  class="fa fa-info-circle"
                  aria-hidden="true"
                ></i>
              </Col>
              <Col className={styles.center}>
                <i class="fa fa-sun" aria-hidden="true"></i>
              </Col>
              <Col className={styles.center}>
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
              </Col>
              <Col className={styles.center}>
                <i class="fa fa-moon" aria-hidden="true"></i>
              </Col>
              <Col xs={4}>
                <Button
                  variant="dark"
                  disabled={this.state.ultimateWin}
                  className={classNames(styles.button, {
                    [styles.lightHeading]: !this.state.darkMode,
                    [styles.highlightButton]: this.state.highlightButton,
                  })}
                  onClick={(e) =>
                    this.handleStartGame(e, this.state.startGameButton)
                  }
                >
                  {this.state.startGameButton}
                </Button>
              </Col>
            </Row>
          </Container>

          <audio className="audio-element-start">
            <source src={start_game_sound}></source>
          </audio>

          <audio className="audio-element-icon">
            <source src={place_icon_sound}></source>
          </audio>
          {this.state.startGameValue === true &&
            this.state.turn === "HUMAN" && (
              <Message
                row_to_place={this.state.rowToPlace}
                column_to_place={this.state.columnToPlace}
                messageForHint={this.state.messageForHint}
              />
            )}
          {this.state.messageForError && (
            <Message messageForError={this.state.messageForError} />
          )}
        </div>
      </div>
    );
  }
}

const cellStyle1 = {
  backgroundColor: "black",
  textAlign: "center",
  border: "1px solid",
  width: "10%",
  padding: "3%",
  flexBasis: 0,
  flexGrow: 1,
  minWidth: 0,
  maxWidth: "90%",
};

const cellStyle2 = {
  backgroundColor: "black",
  textAlign: "center",
  border: "1px solid",
  width: "5%",
  height: 60,
  padding: "1%",
  flexBasis: 0,
  flexGrow: 1,
  minWidth: 0,
  maxWidth: "90%",
};

const cellStyle3 = {
  backgroundColor: "grey",
  textAlign: "center",
  border: "1px solid",
  width: "5%",
  height: 60,
  padding: "1%",
  flexBasis: 0,
  flexGrow: 1,
  minWidth: 0,
  maxWidth: "90%",
};

const heading = {
  display: "inline-block",
  textAlign: "center",
  width: "80%",
  lineHeight: 1.5,
};