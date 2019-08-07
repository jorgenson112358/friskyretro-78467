import React from 'react';
import settings from './settings';
import ActiveBoard from './ActiveBoard';

class NewBoard extends React.Component {
    constructor() {
        super();

        this.state = {
            boardUrl: '',
            allBoards: []
        };

        this.deleteBoard = this.deleteBoard.bind(this);
    }

    deleteBoard(id) {
        if (window.confirm('Delete this board?') === true) {
            var self = this;

            fetch(settings.routeDeleteBoard, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ boardId: id })
            }).then(response => response.json())
            .then((data) => {
                self.setState({
                    allBoards: data
                });
            });
        }
    }

    getLocalBoards() {
        var self = this;
        var temp = localStorage.getItem('BoardIds');
        if (temp != null) {
            var localIds = JSON.parse(temp);

            fetch(settings.routeGetAllBoards, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(localIds)
            }).then(response => response.json())
            .then((data) => {
                self.setState({
                    allBoards: data
                });
            });
        }
    }

    getActiveBoards() {
        var self = this;

        fetch(settings.routeGetAllBoards, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => response.json())
            .then((data) => {
                self.setState({
                    allBoards: data
                });
            });
    }

    componentDidMount() {
        this.getActiveBoards();
    }

    render() {
        var link = '';
        if (this.state.boardUrl !== '') {
            link = <a href={this.state.boardUrl}>Open new board</a>
        }

        var activeBoards = [];
        for (var x = 0; x < this.state.allBoards.length; x++) {
            activeBoards.push(<ActiveBoard key={x} boardData={this.state.allBoards[x]} openBoardUrl={'/?boardId='} deleteBoard={this.deleteBoard} exportBoardUrl={settings.routeExportBoard} />);
        }

        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <div className="page__title align-bottom">
                            <h2>Active Boards</h2>
                        </div>
                        <div className="row">
                            {activeBoards}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewBoard;
