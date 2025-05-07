import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb://localhost:27017/';
const client = new MongoClient(uri, { monitorCommands: true });

//JUST FOR DEBUGGING
// Enable command monitoring to log all MongoDB commands sent by the client
client.on('commandStarted', (event) => {
  console.log('Command Started:', event);
});
//-------------------------------------------------------------------------

const database = client.db('todo-list');
const todos = database.collection('todos');

export const todosService = {
  findAll: async () => {
    const cursor = todos.find({}); //returns Cursor Object that points to the result
    const allTodos = await cursor.toArray(); //makes an array out of the cursor object
    console.log(allTodos);
    return allTodos;
  },
  findById: async (id) => {
    const filter = { _id: new ObjectId(id) };
    const todo = await todos.findOne(filter);
    return todo ?? undefined; // Nullish Coalescing Operator - returns todo if it is not null or undefined
  },
  create: async (todo) => {
    const id = await todos.insertOne(todo); //returns the new id as an object of ObjectId()
    console.log(id);
    return id.insertedId.toHexString(); //converting the ObjectId() in an Hex String of numbers
  },
  update: async (todo, id) => {
    const filter = { _id: ObjectId.createFromHexString(id) }; //validating id to a correct ObjectId()
    const updateDoc = { $set: { ...todo } };
    delete updateDoc.$set.id; // delete client-based id
    const option = { returnDocument: 'after' }; //after = updated Todo, 'before' = original Todo
    const updatedTodo = await todos.findOneAndUpdate(filter, updateDoc, option);
    return updatedTodo.value ?? undefined;
  },
  remove: async (id) => {
    const filter = { _id: ObjectId.createFromHexString(id) };
    const deletedTodo = await todos.findOneAndDelete(filter); //returns an result Object but not the document itself
    return deletedTodo ?? undefined;
  },
};

//TESTING the funcions just with "node todoService-mongo.mjs" in the command line
/* todosService.create({ label: 'new Todo 15:02', done: false }); */
/* todosService.remove('681b5af343921f284c5a0ed5'); */
/* todosService.findAll(); */

//QUESTIONS:
// { ...todo } in update() and not in findOne()?
// delete updateDoc.$set._id -> why do you delete the _id in updateDoc? no _id in todo
// I used findOneAndUpdates() because it returns the document directly

//INFOS
////updateOne() returns result object with a status e.g. matchedCount or modifiedCount
//findOneAndUpdate() -> returns the document, either the original or the updated depending on the option { returnDocument: false }
