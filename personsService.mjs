export const personsService = {
  _state: {
    persons: [
      {
        id: '0',
        firstName: 'Max',
        lastName: 'Mustermann',
      },
      {
        id: '1',
        firstName: 'Erika',
        lastName: 'Musterfrau',
      },
      {
        id: '2',
        firstName: 'John',
        lastName: 'Doe',
      },
      {
        id: '3',
        firstName: 'Jane',
        lastName: 'Doe',
      },
      {
        id: '4',
        firstName: 'Ali',
        lastName: 'Kaya',
      },
    ],
    idCounter: 4,
  },

  findAll: () => {
    const persons = personsService._state.persons.map((person) => ({
      ...person,
    }));
    return persons;
  },
  findById: (id) => {
    const person = personsService._state.persons.find((p) => p.id === id);
    return person ? { ...person } : undefined;
  },
  create: (person) => {
    const newPerson = {
      ...person,
      id: `${(personsService._state.idCounter += 1)}`,
    };
    personsService._state.persons.push(newPerson);
    return newPerson.id;
  },
  update: (person, id) => {
    const personObj = { ...person, id };
    const index = personsService._state.persons.findIndex((p) => p.id === id);

    if (index === -1) {
      return undefined;
    }
    personsService._state.persons[index] = personObj;
    return { ...personsService._state.persons[index] };
  },
  remove: (id) => {
    const index = personsService._state.persons.findIndex((p) => p.id === id);
    //if person does not exits
    if (index === -1) {
      return undefined;
    }
    return personsService._state.persons.splice(index, 1)[0]; //splice returns an array with the deleted obj, thats why we have to use .[0]
  },
};
