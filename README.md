# NoteAppDbServer
A simple CRUD operation server for MongoDB

GET http://localhost:3000/notes

POST http://localhost:3000/notes/add
{
	"Title":"Test Note 3",
    "Content":{
        "Message":"This is my test note 3"
    }
}

POST http://localhost:3000/notes/edit
{
	"id":"5a81578769b9c357943d25d9",
	"record":{
		"Title": "Test Note 3",
        "Content": {
            "Message": "This is my edited test note"
        }
	}
}

POST http://localhost:3000/notes/remove
{
	"id":"5a7e0b9719880a70601b87fd"
}