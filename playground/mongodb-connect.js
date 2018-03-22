const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=> {
    if (err){
        return console.log('Error in connecting to MongoDB: ', err);
    }

    console.log(' Successfully connect to mongoDB');

    const db = client.db('TodoApp');

    // Creating a new Collection and Inserting Data into the DB
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result)=>{
    //     if (err){
    //         return console.log('Unable to insert todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })

    // db.collection('Users').insertOne({
    //     name: 'Abhishek',
    //     age: 26,
    //     location: 'Mumbai'
    // }, (err, result)=>{
    //     if (err){
    //         return console.log('Unable to create a new user', err)
    //     }
    //
    //     // console.log(JSON.stringify(result.ops, undefined, 2));
    // })


    //Find the data from the DB
    // db.collection('Users').find({name: "Abhishek"}).toArray().then((docs)=>{
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err)=>{
    //     console.log('Unable to fetch DB:', err);
    // })


    //Count the data from the result
    db.collection('Users').find({name: "Abhishek"}).count().then((count)=>{
        console.log('Count', count);
    }, (err)=>{
        console.log('Unable to fetch DB:', err);
    })

    client.close();
})

