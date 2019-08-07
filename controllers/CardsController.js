const getUniqueId = require('../getUniqueId');

module.exports = function (app, db, jsonParser) {
    const routeAddCard = '/api/createcard';
    const routeEditCard = '/api/editcard';
    const routeDeleteCard = '/api/deletecard';
    const routeLikeCard = '/api/likecard';

    console.log('registering endpoint: ' + routeAddCard);
    console.log('registering endpoint: ' + routeEditCard);
    console.log('registering endpoint: ' + routeDeleteCard);
    console.log('registering endpoint: ' + routeLikeCard);

    app.post(routeAddCard, function (req, res){
        //BoardId varchar(10)
        //CardId varchar(10)
        //CardBody varchar(500)
        //Cardtype varchar(50)
        //Likes int
        var newCardId = getUniqueId();

        new Promise(function(resolve, reject) {
            db.all('insert into cards values (?, ?, ?, ?, ?)', 
                req.body.boardId, 
                newCardId, 
                req.body.cardBody, 
                req.body.cardType, 
                req.body.likes, 
                function(err, rows) {
                    if (err !== null) {
                        console.log(routeAddCard + ' insert err -> ' + err);
                    }
    
                    resolve(rows);
                }
            );
        })
        .then(function(data) {
            db.all('SELECT * from cards where boardid=?', req.body.boardId, function (err, rows) {
                if (err !== null) {
                    console.log(routeAddCard + ' select cards err -> ' + err);
                }

                var obj = {
                    cardInfo: rows
                };
                res.json(obj);    
            });
        });
    });

    app.post(routeEditCard, function (req, res){
        //BoardId varchar(10)
        //CardId varchar(10)
        //CardBody varchar(500)
        //Cardtype varchar(50)
        //Likes int
        console.log(JSON.stringify(req.body));
        new Promise(function(resolve, reject) {
            db.all('update cards set cardBody=?, Likes=? where BoardId=? and CardId=?', 
                req.body.cardBody, 
                req.body.likes, 
                req.body.boardId, 
                req.body.cardId, 
                //req.body.cardType, <- can't change after adding it, unless you add a drag and drop functionality some day
                function(err, rows) {
                    if (err !== null) {
                        console.log(routeEditCard + ' update err -> ' + err);
                    }
    
                    resolve(rows);
                }
            );
        })
        .then(function(data) {
            db.all('SELECT * from cards where boardid=?', req.body.boardId, function (err, rows) {
                if (err !== null) {
                    console.log(routeEditCard + ' select err -> ' + err);
                }

                var obj = {
                    cardInfo: rows
                };
                res.json(obj);    
            });
        });
    });
    
    app.post(routeDeleteCard, function (req, res){
        //BoardId varchar(10)
        //CardId varchar(10)
        //CardBody varchar(500)
        //Cardtype varchar(50)
        //Likes int
        new Promise(function(resolve, reject) {
            db.all('delete from cards where BoardId=? and CardId=?', 
                req.body.boardId, 
                req.body.cardId, 
                //req.body.cardType, <- can't change after adding it, unless you add a drag and drop functionality some day
                function(err, rows) {
                    if (err !== null) {
                        console.log(routeDeleteCard + ' delete err -> ' + err);
                    }
    
                    resolve(rows);
                }
            );
        })
        .then(function(data) {
            db.all('SELECT * from cards where boardid=?', req.body.boardId, function (err, rows) {
                if (err !== null) {
                    console.log(routeDeleteCard + ' select err -> ' + err);
                }

                var obj = {
                    cardInfo: rows
                };
                res.json(obj);    
            });
        });
    });

    app.post(routeLikeCard, function (req, res) {
        //BoardId
        //CardId
        new Promise(function(resolve, reject) {
            db.all('update cards set Likes=Likes+1 where BoardId=? and CardId=?',
                req.body.boardId,
                req.body.cardId,
                function(err, rows) {
                    if (err !== null) {
                        console.log(routeLikeCard + ' update err -> ' + err);
                    }
    
                    resolve(rows);
                }
            );

        })
        .then(function(data) {
            db.all('SELECT * from cards where boardid=?', req.body.boardId, function (err, rows) {
                if (err !== null) {
                    console.log(routeLikeCard + ' select err -> ' + err);
                }

                var obj = {
                    cardInfo: rows
                };
                res.json(obj);    
            });
        });
    });
}
