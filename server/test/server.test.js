const expect = require('expect');
const request = require('supertest');

var {app} = require('./../server.js');
var {Todo} = require('./../models/todos.js');

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        done();
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
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
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
                expect(todos.length).toBe(0);
                done();
            }).catch((e)=>{
                done(e);
            })
        })
    });
});