import 'regenerator-runtime/runtime';
import axios from 'axios';
const crypto = require('crypto');

//////////////////////////////////////////////////
const listenAddTodos = async () => {
  try {
    const AddTodos = document.querySelector('#add-todos');
    const InputTodos = document.querySelector('#input-todos');
    const todolist = document.querySelector('.todos-list');
    const countNotDone = document.querySelector('#count-todos');

    let lineThroughCountStr = countNotDone.innerText;
    let lineThroughCount = Number(lineThroughCountStr);

    AddTodos.addEventListener('click', async () => {
      const input = InputTodos.value;
      if (input == "") {
        alert("input can't be empty");
        return;
      }
      const todoItem = document.createElement('li');
      const todoContent = document.createElement('div');
      const delButton = document.createElement('button');
      todoItem.className = "todos-item";
      todoContent.className = "todo-text";

      todoContent.textContent = input;
      delButton.innerText = "Delete";

      todolist.appendChild(todoItem);
      todoItem.appendChild(todoContent);
      todoItem.appendChild(delButton);

      todoContent.addEventListener('click', () => {
        todoContent.classList.toggle('line-through');
        if (todoContent.classList.contains('line-through')) {
          lineThroughCount++;
        } else {
          lineThroughCount--;
        }
        countNotDone.innerText = lineThroughCount;
      });

      delButton.addEventListener('click', () => {
        if (todoContent.classList.contains('line-through')) {
          lineThroughCount--;
          countNotDone.innerText = lineThroughCount;
        }
        todoItem.remove();
      });

      InputTodos.value = "";

    });

  } catch (errors) {
    console.error(errors);
  }
}

const main = async () => {
  listenAddTodos();
}
main();
