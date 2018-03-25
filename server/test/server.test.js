const expect = require('expect');
const request = require('supertest');

var {app} = require('./../server.js');
var {Todo} = require('./../models/todos.js');

var todos = [{
    text : "Thsi is the 1st todo"
}, {
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