var stream = require('stream');
const getUniqueId = require('../getUniqueId');

module.exports = function(app, db, jsonParser) {
    const routeGetAllBoards = '/api/getallboards';
    const routeGetBoardById = '/api/getboardbyid';
    const routeCreateBoard = '/api/createboard';
    const routeDeleteBoard = '/api/deleteboard';
    const routeExportBoard = '/api/exportboard/:boardId';

    console.log('registering endpoint: ' + routeGetAllBoards);
    console.log('registering endpoint: ' + routeGetBoardById);
    console.log('registering endpoint: ' + routeCreateBoard);
    console.log('registering endpoint: ' + routeDeleteBoard);
    console.log('registering endpoint: ' + routeExportBoard);

    app.get(routeGetAllBoards, function (req, res) {
        db.all('SELECT * from boards', function (err, rows) {
            if (err !== null) {
                console.log(routeGetAllBoards + ' err -> ' + err);
            }
            
            res.json(rows);
        });
    });
    // app.get(routeGetAllBoards, function (req, res) {
    //     db.all('SELECT * from boards where boardId in ?', req.body.localIds, function (err, rows) {
    //         if (err !== null) {
    //             console.log(routeGetAllBoards + ' err -> ' + err);
    //         }
            
    //         res.json(rows);
    //     });
    // });

    app.post(routeGetBoardById, function (req, res) {
        //expects boardId
        new Promise(function(resolve, reject) {
            db.all('SELECT * from boards where boardid=?;', req.body.boardId, function (err, rows) {
                if (err !== null) {
                    console.log(routeGetBoardById + ' select board err -> ' + err);
                }

                resolve(rows);
            });    
        })
        .then(function(data) {
            db.all('SELECT * from cards where boardid=?', req.body.boardId, function (err, rows) {
                if (err !== null) {
                    console.log(routeGetBoardById + ' select cards err -> ' + err);
                }

                var obj = {
                    boardInfo: data,
                    cardInfo: rows
                };
                res.json(obj);    
            });
        });
    });

    app.post(routeCreateBoard, function (req, res) {
        //schema: BoardId, BoardTitle, CreatedTime
        var newId = getUniqueId();

        db.all('insert into boards values (?, ?, CURRENT_TIMESTAMP)', 
            newId,
            req.body.boardTitle, 
            function (err, rows) {
                if (err !== null) {
                    console.log(routeCreateBoard + ' err -> ' + err);
                    res.json({boardId: null, error: 'Internal server error. Please try again.'});
                } 
                else {
                    res.json({boardId: newId});
                }
            }
        );
    });

    app.post(routeDeleteBoard, function (req, res) {
        //boardId
        //schema: BoardId, BoardTitle, CreatedTime

        db.serialize(() => {
            db.run('delete from boards where boardId=?', req.body.boardId)
              .run('delete from cards where boardId=?', req.body.boardId)
              .all('SELECT * from boards;', function (err, rows) {
                if (err !== null) {
                    console.log(routeDeleteBoard + ' select err -> ' + err);
                }

                res.json(rows);
            }); 
        });
    });

    app.get(routeExportBoard, function (req, res) {
        var exportBoardId = req.params.boardId;

        //expects boardId
        new Promise(function(resolve, reject) {
            db.all('SELECT BoardTitle from boards where boardid=?;', exportBoardId, function (err, rows) {
                if (err !== null) {
                    console.log(routeGetBoardById + ' select board err -> ' + err);
                }

                resolve(rows);
            });    
        })
        .then(function(data) {
            db.all('SELECT CardBody,Cardtype,Likes from cards where boardid=?', exportBoardId, function (err, rows) {
                if (err !== null) {
                    console.log(routeGetBoardById + ' select cards err -> ' + err);
                }

                var obj = {
                    boardInfo: data,
                    cardInfo: rows
                };
                //res.json(obj);

                //------------------
                var output = "CardBody,CardType,Likes\n";

                var filename = obj.boardInfo[0].BoardTitle + ".csv";
                filename = filename.replace(/ /g, '_').replace('&', 'And');
                
                for (var x = 0; x < obj.cardInfo.length; x++) {
                    output += '"' + obj.cardInfo[x].CardBody + '","' + obj.cardInfo[x].Cardtype + '","' + obj.cardInfo[x].Likes + '"\n';
                }
        
                var fileContents = Buffer.from(output, "utf-8");
                var readStream = new stream.PassThrough();
                readStream.end(fileContents);
              
                res.set('Content-disposition', 'attachment; filename=' + filename);
                res.set('Content-Type', 'text/plain');
              
                readStream.pipe(res);
            });
        });
    });
}
