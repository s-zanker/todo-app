//ROUTING / HTTP-HANDLING OF PERSONS
import express from 'express';
import { personsService } from '../personsService.mjs';

export const personsRouter = express.Router();

personsRouter.get('/', (req, res) => {
  res.send(personsService.findAll());
});
personsRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  const person = personsService.findById(id);
  if (person === undefined) {
    res.status(404).send({ error: 'Person not found' });
    return;
  }
  res.send(person);
});

personsRouter.post('/', (req, res) => {
  // DATA TO THE THE REQUEST ---------------------------------------------
  /* const newPerson = { firstName: 'Sylvia', lastName: 'Codingheart' }; */
  //----------------------------------------------------------------------
  const newPerson = req.body;
  console.log(newPerson);
  const id = personsService.create(newPerson);
  res.status(201).send({ id }); //equal to { id: id }. we send { id: "5" } and express makes it to an json { "id": "5"}
});

personsRouter.put('/:id', (req, res) => {
  const { id } = req.params;

  const newPerson = req.body;
  console.log(newPerson);
  const person = personsService.update(newPerson, id);

  if (person === undefined) {
    res.status(404).send({ error: 'Person not found' });
    return;
  }
  res.send(person);
});

personsRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  const personDeleted = personsService.remove(id);

  if (personDeleted === undefined) {
    res.status(404).send({ error: 'Person not found' });
    return;
  }
  res.status(200).send({ message: 'Person deleted' });
});
