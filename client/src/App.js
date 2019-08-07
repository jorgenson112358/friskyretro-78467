import React, { Component } from 'react';
import 'jquery';
import 'popper.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Board from './Board';
import NewBoard from './NewBoard';
import settings from './settings';
import logo from './images/retro-logo@2x.png';
import clientUtils from './client-utils';

class App extends Component {
  constructor() {
    super();

    this.createBoard = this.createBoard.bind(this);
  }

  createBoard() {
    var newTitle = document.getElementById('newBoardTitle').value;

    if (newTitle == "") {
      alert("Title is required.");
      return;
    }

    fetch(settings.routeCreateBoard, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ boardTitle: newTitle })
    }).then(response => response.json())
    .then((data) => {
      let boardUrl = '/?boardId=' + data.boardId;
      window.location = boardUrl;
    });
  }

  render() {
    //set boardId from query string if it exists
    let boardId = clientUtils.getURLParam(window.location, "boardId");
    
    var boardState = <NewBoard />;
    if (boardId !== "") {
      boardState = <Board />;
    }

    return (
      <div className="App container-fluid">
        <header className="App-header">
          <div className="row">
            <div className="col-12 header__logo">
              <div className="header__logo--center">
                <a href="/"><img className="header__logo-image" src={logo} alt="logo" /></a>
              </div>
            </div>
          </div>        
          <div className="row create-new-board">
              <div className="col-5">
                  <h2 className="new-board__title new-board__center">Create New Board</h2>
              </div>
              <div className="col-5">
                  <input type="text" className="form-control new-board__center" id="newBoardTitle" placeholder="Board title" aria-label="Board title" />
              </div>
              <div className="col-2">
                  <button className="btn btn-primary btn-create-board new-board__center" onClick={this.createBoard} aria-label="Create board">Create New Board</button>
              </div>
          </div>

        </header>
        <main className="main-content">
          {boardState}
        </main>
        <footer>
          <div className="row">
            <div className="col-12">
              <div className="footer">
                Copyright © 2019 IP Sprint 14.6 Hackathon. All Rights Reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
