import React from 'react';
import trash from './images/delete.svg';
import 'font-awesome/css/font-awesome.css';

class ActiveBoard extends React.Component {
    constructor() {
        super();

        this.deleteBoard = this.deleteBoard.bind(this);
    }

    deleteBoard() {
        this.props.deleteBoard(this.props.boardData.BoardId);
    }
    formatDate() {
        //HAHAHAHA Sqlite3 Current_timestamp is in GMT and dates in JS are stupid
        // I could probably just include moment.js or something and make this cleaner
        var temp = new Date(new Date(this.props.boardData.CreatedTime).toString() + ' UTC');
        return temp.toLocaleString();
    }

    render() {
        return (
            <div className="col-12 col-sm-4 col-md-3">
                <div className="active-board">
                    <div className="active-board__body">
                            <div className="active-board__title">
                                <a href={this.props.openBoardUrl + this.props.boardData.BoardId}>
                                    {this.props.boardData.BoardTitle}
                                </a>
                            </div>
                            <div className="active-board__delete-btn">
                                <img className="active-board__delete-icon" src={trash} alt="delete" aria-label={"Delete board " + this.props.boardData.BoardTitle} onClick={this.deleteBoard} />
                            </div>

                        <p className="board__date"><span className="board__date-icon fa fa-calendar"></span>{this.formatDate()}</p>

                    </div>
                    <div className="active-board__footer">
                        <a href={this.props.exportBoardUrl + '/' + this.props.boardData.BoardId} aria-label="Export Board">
                            <span class="fa fa-download active-board__export-btn"></span>
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default ActiveBoard;
