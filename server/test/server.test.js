const expect = require('expect');
const request = require('supertest');
var {ObjectID} = require('mongodb');

var {app} = require('./../server.js');
var {Todo} = require('./../models/todos.js');

var todos = [{
    _id: new ObjectID(),
    text : "Thsi is the 1st todo"
}, {
    _id: new ObjectID(),
    text : "Thsi si the 2nd todo"
}];

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos)
    }).then(()=>{
        done();
    }).catch((err)=>{
        done(err);
    })
})

describe('POST /todos', ()=>{
    it('should save the todos', (done)=>{
        var text = 'This is a test script for todo';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err, res)=>{
                if (err){
                    return done(err);
                }

                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(3);
                    expect(todos[2].text).toBe(text);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })

    })

    it('shoudl not create todo for invalid input', (done)=> {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
        .end((err, res)=>{
            if (err){
                return done(err);
            }

            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            }).catch((e)=>{
                done(e);
            })
        })
    });
});

describe('GET /todos', ()=>{

    it('should return all the todos', (done)=>{

        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2)
            })
            .end(done);
    })
})

describe('GET /todos/:id', ()=>{

    it('should return the todo corresponding to id', (done)=>{

        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.text).toBe(todos[0].text);
            })
            .end(done);
    })

    it('should check for invalid id', (done)=>{

        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    })

    it('should return 404 for if todo not found', (done)=>{
        var newID = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${newID}`)
            .expect(404)
            .end(done);
    })

});

describe('DELETE /todos/:id', ()=>{

    it('should delete the corresponding todo on id', (done)=>{
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end((err, res)=>{
            if(err){
                return done(err);
            }
            Todo.findById(todos[0]._id).then((todo)=>{
                // expect(null).toNotExist();
                done();
            }).catch((e)=>{
                done(e);
            })
        });
    })

    it('should check the invalid todo', (done)=>{
        request(app)
            .delete('/todos/12332')
            .expect(404)
            .end(done);
    })

    it('should send 404 if todo not found', (done)=>{
        var newID = new ObjectID().toHexString();
        request(app)
        .delete(`/todos/${newID}`)
        .expect(404)
        .end(done);
    })


});