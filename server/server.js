var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todos.js');
var {User} = require('./models/users.js');

var app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
    var todo = new Todo({
        text : req.body.text,
        completed : req.body.completed
    })

    todo.save().then((usr)=>{
        res.send(usr);
    }, (err)=>{
        res.status(400).send(err)
    });
})

app.get('/todos', (req, res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    }).catch((err)=>{
        res.status(400).send(err);
    })
})

app.get('/todos/:id', (req, res)=>{
    var id = req.params.id
    if (!ObjectID.isValid(id)){
        return res.status(404).send('Invalid Object ID')
    }
    Todo.findById(id).then((todos)=>{
        if (!todos){
            return res.status(404).send("Id not found")
        }
        res.status(200).send({todos});
    }).catch((err)=>{
        res.status(400).send(err);
    })
})

app.listen(3000, ()=>{
   console.log('Server is running at port 3000');
});

module.exports = {app};