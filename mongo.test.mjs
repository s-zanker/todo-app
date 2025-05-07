import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017/';

const client = new MongoClient(uri);

const db = client.db('todo-list');
const todos = db.collection('todos');

async function runTodoQuery() {
  return await todos.find().toArray();
}

//returns a promise
runTodoQuery()
  .then((allTodos) => {
    console.log(allTodos);
  })
  .finally(() => {
    client.close();
  });
