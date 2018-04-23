var assert = require('assert');
var app = require('express')();
var bodyParser = require('body-parser');
var monk = require('monk');
var morgan  = require('morgan');
// var db = monk('mongodb://localhost:27017/testproject');

var mongoURL = "mongodb://noteapp:OjSDp1ovDTVNEPvNgAcymhSYKztVmTp3VOSC9OZJns0g0hkDZAtlEWtjpY7anDNZPhBoX5ps54eaRllQkAl5nQ==@noteapp.documents.azure.com:10255/?ssl=true";
var port = 3000;
var db = monk(mongoURL);
const collectionName = 'documents';

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.listen(port, () => console.log('Listening on port ' + port + '!'));
app.use(bodyParser.json()); 
app.use(function(req,res,next){
    req.db = db;
    next();
});
app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'));
app.use(allowCrossDomain);

app.get('/', function(req, res){
    try {
        // res.json({"hello":"world"});
        if (req.db) {
            res.render('index.html', { dbstatus : "Connected" });
        } else {
            res.render('index.html', { dbstatus : "Not Connected" });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({error:"Something went wrong"});
    }
});

module.exports = app;