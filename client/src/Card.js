import React from 'react';
import 'font-awesome/css/font-awesome.css';
import trashIcon from './images/delete.svg';
import editIcon from './images/edit.svg';


class Card extends React.Component {
    constructor(props) {
        super(props);

        this.delete = this.delete.bind(this);
        this.editItem = this.editItem.bind(this);
        this.likeItem = this.likeItem.bind(this);
    }

    likeItem() {
        this.props.likeItem(this.props.data.CardId);
    }
    editItem() {
        this.props.editItem(this.props.Cardtype, this.props.data.CardId, this.props.data.CardBody, this.props.data.Likes);
    }

    delete() {
        if (window.confirm("Delete this card?")) {
            this.props.delete(this.props.Cardtype, this.props.data.CardId);
        }
    }

    render() {
        return (
            <div className="col-12">
                <div className="board__card">
                    <div className="card__body">
                        <div className="card__text">
                            <p tabIndex="0" aria-label={this.props.data.CardBody}>{this.props.data.CardBody}</p>
                        </div>
                        <div className="card__delete">
                            <button className="reset-button-style card__delete--btn" alt="delete" aria-label="Delete card" onClick={this.delete} >
                                <img src={trashIcon} />
                            </button>
                        </div>
                    </div>
                    <div className="card__footer">
                        <div className="row">
                            <div className="col-6 card__footer--heart">
                                <button className="reset-button-style card__footer--img mx-auto d-block" onClick={this.likeItem} aria-label="Like card" alt="Like card"><span className="fa fa-heart"></span><span className="card__like-count">{'+' + this.props.data.Likes}</span></button>
                            </div>
                            <div className="col-6">
                                <button className="reset-button-style mx-auto d-block" onClick={this.editItem} aria-label="Edit card" alt="edit card" >
                                    <img className="card__footer--img" src={editIcon} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Card;