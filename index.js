var assert = require('assert');
var app = require('express')();
var bodyParser = require('body-parser');
var monk = require('monk');
var morgan  = require('morgan');
// var db = monk('mongodb://localhost:27017/testproject');

// var mongoURL = "mongodb://makarov:makarov007@ds255319.mlab.com:55319/notedb";
var mongoURL = "mongodb+srv://makarov:makarov007@cluster0.dygtr.mongodb.net/notedb?retryWrites=true&w=majority"
// var mongoURL = "mongodb://localhost:27017/testproject";
// var port = 3000;
var port = process.env.PORT || 3000;
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


app.get('/notes/', async(req, res)=> {
    try{
        var db = req.db;
        var collection = db.get(collectionName);
        collection.find({},{},function(e,docs){
            return res.json(docs);
        });
        await db.then(() => 3);
    }catch(e){
        console.log(e);
        res.status(500).json({error:"Something went wrong"});
    }
});

app.post('/notes/add', async(req, res)=> {
    try{
        var db = req.db;
        var collection = db.get(collectionName);
        if(req.body){
            collection.insert(req.body, function(err, result){
                if(err == null)
                    return res.json({success:"Record inserted successfully"});
                else
                    throw err;
            });
            await db.then(() => 3);
        }
        else{
            return res.json({error:"Missing Data"});            
        }        
    }catch(e){
        console.log(e);
        res.status(500).json({error:"Something went wrong"});
    }
});

app.post('/notes/remove', async(req, res)=> {
    try{
        var db = req.db;
        var collection = db.get(collectionName);
        var userToDelete = req.body['id'];
        if(userToDelete){
            collection.remove({ '_id' : userToDelete }, function(err) {
                if(err == null)
                    return res.json({success:"Record deleted successfully"});
                else
                    throw err;
            });
            await db.then(() => 3);
        }
        else{
            return res.json({error:"Missing Data"});            
        }        
    }catch(e){
        console.log(e);
        res.status(500).json({error:"Something went wrong"});
    }
});

app.post('/notes/edit', async(req, res)=> {
    try{
        var db = req.db;
        var collection = db.get(collectionName);
        var userToUpdate = req.body['id'];
        var updatedRecord = req.body['record'];
        // console.log(userToUpdate, updatedRecord);
        if(userToUpdate && updatedRecord){
            collection.update({ '_id' : userToUpdate }, { $set: updatedRecord }, function(err, result) {
                if(err == null && result.nModified == 1)
                    return res.json({success:"Record edited successfully"});
                else if(err == null && result.nModified != 1)
                    return res.json({error:"Record was not edited"});
                else
                    throw err;
            });
            await db.then(() => 3);
        }
        else{
            return res.json({error:"Missing Data"});            
        }
    }catch(e){
        console.log(e);
        res.status(500).json({error:"Something went wrong"});
    }
});


