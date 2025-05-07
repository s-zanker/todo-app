import { deepStrictEqual, strictEqual } from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { todosService } from './todosService.mjs';

// describe is used for grouping tests into suites.
// suite() would be an alternative option for this
describe('todosService', () => {
  // beforeEach gets called before each test / it within
  // this describe at any level.
  // Having it on top means it gets called for every todosService test.
  beforeEach(() => {
    todosService._state = {
      todos: [
        { id: '0', label: 'Create', done: true },
        { id: '1', label: 'Update', done: false },
      ],
      idCounter: 1,
    };
  });

  // describes can be nested as much as you want
  describe('findAll()', () => {
    // our actual tests are in its.
    // test() is another option for this.
    it('returns all todos', () => {
      // arrange / act
      const todos = todosService.findAll();

      // assert
      deepStrictEqual(todos, todosService._state.todos);
    });

    it('prevents changes by consuming code', () => {
      // arrange / act
      const todos = todosService.findAll();
      todos[0].done = false;
      const todos_2 = todosService.findAll();

      // assert
      strictEqual(todos_2[0].done, true);
    });
  });

  describe('findById(id)', () => {
    it('returns the matching todo if it exists', () => {
      // arrange - what do i need?
      const id = '0';
      // act - what do i wanna test?
      const todo = todosService.findById(id);
      // assert - what should be the result?
      deepStrictEqual(todo, todosService.findAll()[0]);
    });

    it('returns undefined if no todo is found', () => {
      // arrange
      const id = 'does not exist';
      // act
      const todo = todosService.findById(id);
      // assert
      strictEqual(todo, undefined);
    });

    it('prevents changes by consuming code', () => {
      // arrange
      const id = '0';
      // act
      const copy = todosService.findById(id);
      copy.done = false;
      const original = todosService.findById(id);
      // assert
      strictEqual(original.done, true);
    });
  });

  describe('create(todo)', () => {
    let newEntry;

    beforeEach(() => {
      newEntry = { label: 'new todo', done: false };
    });

    it('creates a new todo', () => {
      // arrange / act
      const newId = todosService.create(newEntry);
      const countAfter = todosService.findAll().length;
      const newTodo = todosService.findById(newId);
      // assert
      strictEqual(countAfter, 3);
      strictEqual(newTodo.label, newEntry.label);
    });

    it('generates and returns the new todos id', () => {
      // arrange / act
      const id = todosService.create(newEntry);
      const todo = todosService.findById(id);
      // assert
      deepStrictEqual(todo, { ...newEntry, id });
    });

    it('can deal with deletions', () => {
      // arrange / act
      todosService.remove('0');
      const id = todosService.create(newEntry);
      const todo = todosService.findById(id);
      // assert
      deepStrictEqual(todo, { ...newEntry, id });
    });

    it('prevents changes by consuming code', () => {
      //arrange/act
      const id = todosService.create(newEntry);
      newEntry.done = true;
      const newTodo = todosService.findById(id);
      //assert
      strictEqual(newTodo.done, false);
    });
  });

  describe('update(todo, id)', () => {
    let updatedTodoData;
    beforeEach(() => {
      updatedTodoData = { label: 'updated', done: false };
    });

    it('updates the todo with the passed id', () => {
      //arrange
      const id = '0';
      //act
      const updatedTodo = todosService.update(updatedTodoData, id);
      const expectedTodo = { ...updatedTodoData, id };
      //assert
      deepStrictEqual(todosService.findById(id), expectedTodo);
    });

    it('returns the updated todo', () => {
      //arrange
      const id = '1';
      //act
      const updatedTodo = todosService.update(updatedTodoData, id);
      const expectedTodo = { ...updatedTodoData, id };
      //assert
      deepStrictEqual(updatedTodo, expectedTodo);
    });

    it('returns undefined if no todo is found', () => {
      //arrange
      const id = 'does not exist';
      //act
      const updatedTodo = todosService.update(updatedTodoData, id);
      //assert
      strictEqual(updatedTodo, undefined);
    });

    // Changing the original input object after the update call
    // must not affect the stored todo
    it('prevents changes by consuming code', () => {
      //arrange
      const id = '0';
      //act
      const updatedTodo = todosService.update(updatedTodoData, id);
      updatedTodoData.done = true;
      //assert
      deepStrictEqual(todosService.findById(id).done, false);
    });
  });

  describe('remove(id)', () => {
    it('removes the todo with the passed id', () => {
      //arrange
      const id = '0';
      //act
      const removedTodo = todosService.remove(id);
      //assert
      strictEqual(todosService.findAll().length, 1);
      strictEqual(todosService.findById(id), undefined);
    });
    it('returns the removed todo', () => {
      //arrange
      const id = '0';
      //act
      const todoToRemove = todosService.findById(id);
      const removedTodo = todosService.remove(id);
      //assert
      deepStrictEqual(removedTodo, todoToRemove);
    });
    it('returns undefined if todo does not exist', () => {
      //arrange
      const id = 'does not exist';
      //act
      const removedTodo = todosService.remove(id);
      //assert
      strictEqual(removedTodo, undefined);
    });
    it('does not change state if todo does not exist', () => {
      //arrange
      const id = 'does not exist';
      //act
      const todosBefore = todosService.findAll();
      const removedTodo = todosService.remove(id);
      const todosAfter = todosService.findAll();

      //assert
      deepStrictEqual(todosAfter, todosBefore);
    });
  });
});
