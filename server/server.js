var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var _ = require('lodash');
var jwt = require('jsonwebtoken');

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
        res.send({todos});
    }).catch((err)=>{
        res.status(400).send(err);
    })
})

app.delete('/todos/:id', (req, res)=>{
    var id = req.params.id;
    console.log(req.body);
    if (!ObjectID.isValid(id)){
        return res.status(404).send('Invalid Object ID')
    }
    Todo.findByIdAndRemove(id).then((todo)=>{
        if (!todo){
            res.status(404).send("Todo not found")
        }
        res.send({todo});
    }).catch((err)=>{
        res.status(400).send(err);
    })
});

app.patch('/todos/:id', (req, res)=>{
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid Object ID')
    }
    var body = _.pick(req.body, ["text", "completed"]);

    console.log(body.completed);
    if (body.completed == true){
        body.completedAt = new Date().getTime();
    } else {

        body.completedAt = null;
        body.completed = false;
    }

    Todo.findByIdAndUpdate(id, {$set : body}, {new : true}).then((todo)=>{
        if (!todo){
    return res.status(404).send("Todo not found");
    }
    res.send({todo});
    }).catch((err)=>{
        res.status(400).send(err);
    });

});

// New User Creation
app.post('/users', (req, res)=> {
    var body = _.pick(req.body, ["email", "password"]);
    var user = new User(body);

    user.save().then(()=>{
        // res.send(user);
        return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth', token).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    })
});



app.listen(3000, ()=>{
   console.log('Server is running at port 3000');
});

module.exports = {app};