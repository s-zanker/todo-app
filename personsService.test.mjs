import { deepStrictEqual, strictEqual } from 'assert'; //Test-Assertion-Modul von Node.js
import { beforeEach, describe, it } from 'node:test'; //Test-Framework von Node.js
import { personsService } from './personsService.mjs';

describe('personsService', () => {
  beforeEach(() => {
    personsService._state = {
      persons: [
        { id: '0', firstName: 'John', lastName: 'Doe' },
        { id: '1', firstName: 'Jane', lastName: 'Doe' },
      ],
      idCounter: 1,
    };
  });

  describe('findAll()', () => {
    it('returns all persons', () => {
      //arrange/act
      const persons = personsService.findAll();
      //assert
      deepStrictEqual(persons, personsService._state.persons);
    });
    it('prevents changes by consuming code', () => {
      //arrange/act
      const persons = personsService.findAll();
      persons[0].firstName = 'Hacked';
      const original = personsService.findAll();
      //assert
      strictEqual(original[0].firstName, 'John');
    });
  });

  describe('findById(id)', () => {
    it('returns the matching person if it exits', () => {
      //arrange
      const id = '1';
      //act
      const person = personsService.findById(id);
      //assert
      deepStrictEqual(person, personsService.findAll()[1]);
    });
    it('returns undefined if no person is found', () => {
      //arrange
      const id = 'does not exist';
      //act
      const person = personsService.findById(id);
      //assert
      strictEqual(person, undefined);
    });
    it('prevents changes by consuming code', () => {
      //arrange
      const id = '0';
      //act
      const person = personsService.findById(id);
      person.firstName = 'Hacked';
      const original = personsService.findById(id);
      //assert
      deepStrictEqual(original.firstName, 'John');
    });
  });

  describe('create(person)', () => {
    let newPersonObj;

    beforeEach(() => {
      newPersonObj = { firstName: 'Santa', lastName: 'Clause' };
    });
    it('creates a new person', () => {
      //arrange/act
      const newId = personsService.create(newPersonObj);
      const countAfter = personsService.findAll().length;
      const newPerson = personsService.findById(newId);
      //assert
      strictEqual(countAfter, 3);
      deepStrictEqual(newPerson, { ...newPersonObj, id: '2' });
    });
    it('generates and returns the new person id', () => {
      //arrange/act
      const newId = personsService.create(newPersonObj);
      const expectedId = '2';
      //assert
      strictEqual(newId, expectedId);
    });
    it('can deal with deletions', () => {
      //arrange/act
      personsService.remove('0');
      const newId = personsService.create(newPersonObj);
      const countOfPersons = personsService.findAll().length;
      //assert
      strictEqual(newId, '2');
      strictEqual(countOfPersons, 2);
    });
    it('prevents changes by consuming code', () => {
      //arrange/act
      const newId = personsService.create(newPersonObj);
      newPersonObj.firstName = 'Hacked';
      const newPerson = personsService.findById(newId);
      //assert
      deepStrictEqual(newPerson.firstName, 'Santa');
    });
  });
  describe('update(person, id)', () => {
    let newPersonObj;

    beforeEach(() => {
      newPersonObj = { firstName: 'Joel', lastName: 'Miller' };
    });
    it('updates the person with the passed id', () => {
      //arrange
      const id = '0';
      //act
      const updatedPerson = personsService.update(newPersonObj, id);
      const expectedPerson = { ...newPersonObj, id };
      //assert
      deepStrictEqual(personsService.findById(id), expectedPerson);
    });
    it('returns the updated person', () => {
      //arrange
      const id = '0';
      //act
      const updatedPerson = personsService.update(newPersonObj, id);
      //assert
      deepStrictEqual(updatedPerson.firstName, 'Joel');
    });
    it('returns undefined if no person is found', () => {
      //arrange
      const id = 'does not exist';
      //act
      const updatedPerson = personsService.update(newPersonObj, id);
      //assert
      strictEqual(updatedPerson, undefined);
    });
    it('prevents changes by consuming code', () => {
      //arrange
      const id = '0';
      //act
      const updatedPerson = personsService.update(newPersonObj, id);
      newPersonObj.firstName = 'Hacked';
      //assert
      strictEqual(updatedPerson.firstName, 'Joel');
    });
  });

  describe('remove(id)', () => {
    it('removes the person with matches the id', () => {
      //arrange
      const id = '0';
      //act
      const removedPerson = personsService.remove(id);
      //assert
      strictEqual(personsService.findAll().length, 1);
      strictEqual(personsService.findById(id), undefined);
    });
    it('returns the person who was deleted', () => {
      // arrange
      const id = '0';
      //act
      const personToRemove = personsService.findById(id);
      const removedPerson = personsService.remove(id);
      //assert
      deepStrictEqual(removedPerson, personToRemove);
    });
    it('returns undefined, when the person does not exits', () => {
      //arrange
      const id = 'does not exist';
      //act
      const removedPerson = personsService.remove(id);
      //assert
      strictEqual(removedPerson, undefined);
    });

    it('does not change state if todo does not exist', () => {
      //arrange
      const id = 'does not exist';
      //act
      const removedPerson = personsService.remove(id);
      //assert
      deepStrictEqual(personsService.findAll().length, 2);
    });
  });
});
