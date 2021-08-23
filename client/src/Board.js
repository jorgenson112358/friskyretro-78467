import React from 'react';
import Card from './Card';
import $ from 'jquery';
import settings from './settings';
import clientUtils from './client-utils';

class Board extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            boardData: [],
            cardData: [],
            formState: { title: 'Modal Title', state: 'none' },
            editing: {
                state: false
            },
			refreshCount: 10,
			intervalId: null
        };

        this.addWentWell = this.addWentWell.bind(this);
        this.addWentBadly = this.addWentBadly.bind(this);
        this.addActionItem = this.addActionItem.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.deleteCard = this.deleteCard.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.editItem = this.editItem.bind(this);
        this.likeItem = this.likeItem.bind(this);
		this.getAutoRefreshStatus = this.getAutoRefreshStatus.bind(this);
		this.refreshTimer = this.refreshTimer.bind(this);
    }

    refreshData() {
        var self = this;
        //doesn't work with IE11 or Edge
        //let params = (new URL(document.location)).searchParams;
        //let boardId = params.get("boardId");
        let boardId = clientUtils.getURLParam(window.location, 'boardId');

        fetch(settings.routeGetBoardById, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ boardId: boardId })
        }).then(response => response.json())
            .then((data) => {
                self.setState({
                    boardData: data.boardInfo,
                    cardData: data.cardInfo,
                });
            });
    }

    deleteCard(cardType, id) {
        var self = this;
        let boardId = clientUtils.getURLParam(window.location, 'boardId');

        fetch(settings.routeDeleteCard, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    boardId: boardId,
                    cardType: cardType,
                    cardId: id,
                    method: "delete"
                }
            )
        }).then(response => response.json())
            .then((data) => {
                self.setState({
                    cardData: data.cardInfo
                });
            });
    }

    addWentWell() {
        this.setState({ formState: { title: 'The Good', state: 'wentwell' } });
    }
    addWentBadly() {
        this.setState({ formState: { title: 'The Bad', state: 'wentbadly' } });
    }
    addActionItem() {
        this.setState({ formState: { title: 'Action Item', state: 'actionitem' } });
    }

    editItem(cardType, cardId, cardBody, likes) {
        this.setState(
            {
                editing:
                {
                    state: true,
                    cardType: cardType,
                    cardId: cardId,
                    likes: likes
                }
            }
        );
        //open modal
        document.getElementById('newBody').value = cardBody;
        $('#wentWellModal').modal();
    }

    likeItem(cardId) {
        var self = this;
        let boardId = clientUtils.getURLParam(window.location, 'boardId');

        let newObj = {
            boardId: boardId,
            cardId: cardId,
        };

        fetch(settings.routeLikeCard, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newObj)
        })
        .then(response => response.json())
        .then((data) => {
            self.setState({
                cardData: data.cardInfo
            });
        });
    }

    sendMessage(msg) {
        msg.boardId = clientUtils.getURLParam(window.location, 'boardId');
        var self = this;
        var serverUrl = '';
        if (msg.method === 'add') {
            serverUrl = settings.routeAddCard;
        }
        else if (msg.method === 'edit') {
            serverUrl = settings.routeEditCard;
        }
        else {
            alert('Error: unknown message type!');
            return;
        }

        return fetch(serverUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(msg)
        }).then(response => response.json())
            .then((data) => {
                self.setState({
                    cardData: data.cardInfo
                });

                document.getElementById('newBody').value = '';
                $('#wentWellModal').modal('hide');
            });
    }

    saveChanges() {
        let boardId = clientUtils.getURLParam(window.location, 'boardId');
        var method = 'add';
        var cardId = null;
        var cardType = this.state.formState.state;
        var likeCount = 0;
        if (this.state.editing.state === true) {
            method = 'edit';
            cardId = this.state.editing.cardId;
            cardType = this.state.editing.cardType;
            likeCount = this.state.editing.likes;
            this.setState({ editing: { state: false } });
        }

        let newObj = {
            method: method,
            boardId: boardId,
            cardType: cardType,
            cardId: cardId,
            cardBody: document.getElementById('newBody').value,
            likes: likeCount
        };

        this.sendMessage(newObj);
    }

	getAutoRefreshStatus() {
		if (this.state.refreshCount <= 0) {
			return <span className="page__refresh-status">Auto-refresh: off</span>
		}

		return null;
	}

	refreshTimer() {
		if (this.state.refreshCount <= 0) {
			clearInterval(this.state.intervalId);
		}
		else {
			this.setState((prevState) => ({
				refreshCount: prevState.refreshCount - 1
			}));

			this.refreshData();
		}
	}

    componentDidMount() {
        this.refreshData();
		var intervalId = setInterval(this.refreshTimer, settings.boardRefreshTime);
		this.setState({
			intervalId: intervalId
		});

        $('#wentWellModal').on('shown.bs.modal', function () {
            $('#newBody').trigger('focus')
        });
    }

    render() {
        var wentWellRows = [];
        var wentBadlyRows = [];
        var actionItemsRows = [];

        for (var x = 0; x < this.state.cardData.length; x++) {
            if (this.state.cardData[x].Cardtype === 'wentwell') {
                wentWellRows.push(<Card key={x} data={this.state.cardData[x]} cardType='wentwell' delete={this.deleteCard} editItem={this.editItem} likeItem={this.likeItem} />);
            }
            else if (this.state.cardData[x].Cardtype === 'wentbadly') {
                wentBadlyRows.push(<Card key={x} data={this.state.cardData[x]} cardType='wentwell' delete={this.deleteCard} editItem={this.editItem} likeItem={this.likeItem} />);
            }
            else if (this.state.cardData[x].Cardtype === 'actionitem') {
                actionItemsRows.push(<Card key={x} data={this.state.cardData[x]} cardType='wentwell' delete={this.deleteCard} editItem={this.editItem} likeItem={this.likeItem} />);
            }
        }

        var boardTitle = '';
        if (this.state.boardData.length > 0) {
            boardTitle = this.state.boardData[0].BoardTitle; //since it's a SELECT statement it comes back as an array
        }

        return (
            <div>
                <div className="row page__title">
                    <div className="col-9">
                        <div>
                            <h2>{boardTitle}</h2>
                        </div>
                    </div>
					<div className="col-3">
						{this.getAutoRefreshStatus()}
						<button type="button" className="btn btn-primary btn-refresh" onClick={this.refreshData}>Refresh Board</button>
					</div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-4 went-well">
                        <div className="column__title">
                            <h3>The Good</h3>
                            <button className="reset-button-style add-btn" onClick={this.addWentWell} data-toggle="modal" data-target="#wentWellModal" aria-label="Add new what went well card"><span className="fa fa-plus-circle"></span></button>
                        </div>
                        <div className="row">
                            {wentWellRows}
                        </div>
                    </div>
                    <div className="col-12 col-md-4 went-badly">
                        <div className="column__title">
                            <h3>The Bad</h3>
                            <button className="reset-button-style add-btn" onClick={this.addWentBadly} data-toggle="modal" data-target="#wentWellModal" aria-label="Add new what went badly card"><span className="fa fa-plus-circle"></span></button>
                        </div>
                        <div className="row">
                            {wentBadlyRows}
                        </div>
                    </div>
                    <div className="col-12 col-md-4 action-items">
                        <div className="column__title">
                            <h3>The Action Items</h3>
                            <button className="reset-button-style add-btn" onClick={this.addActionItem} data-toggle="modal" data-target="#wentWellModal" aria-label="Add new action item card"><span className="fa fa-plus-circle"></span></button>
                        </div>
                        <div className="row">
                            {actionItemsRows}
                        </div>
                    </div>
                </div>
                <div id="wentWellModal" className="modal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{this.state.formState.title}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <label className="col-3">Content</label>
                                    <textarea cols="40" rows="6" id="newBody" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.saveChanges}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Board;