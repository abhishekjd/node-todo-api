var express = require('express');
var bodyParser = require('body-parser');

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




app.listen(3000, ()=>{
   console.log('Server is running at port 3000');
});