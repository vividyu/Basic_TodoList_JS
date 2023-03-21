import 'regenerator-runtime/runtime';
import axios from 'axios';

const api_key = "2f39ac8abf607fbbc583ce393c0f56f3";
const BASE_URL = `https://api.themoviedb.org/3/trending/all/day?api_key=${api_key}`;
const CONFIG_URL = `https://api.themoviedb.org/3/configuration?api_key=${api_key}`;


// Get the image container element
// const imageContainer = document.querySelector('.image-container');

// Make a GET request to the API
// fetch(apiUrl)
//   .then(response => response.json())
//   .then(data => {
//     // Loop through the image URLs and create <img> elements
//     data.forEach(imageUrl => {
//       const image = document.createElement('img');
//       image.src = imageUrl;
//       image.classList.add('image');
//       imageContainer.appendChild(image);
//     });
//   })
//   .catch(error => console.error(error));

const getMovieInfo = async () => {
  try {
    const config = await axios.get(CONFIG_URL);
    const cfgdata = config.data.images;
    const imgUrlPrefix = cfgdata.base_url + cfgdata.poster_sizes[4];
    console.log(imgUrlPrefix);

    const response = await axios.get(BASE_URL);
    const res = response.data.results;
    
    res.forEach(detail => {
      const imgUrl = detail.poster_path;
      console.log(imgUrl);

      const imageContainer = document.querySelector('.image-container');
      const image = document.createElement('img');
      image.src = imgUrlPrefix+imgUrl;
      image.classList.add('image');
      imageContainer.appendChild(image);
    })
    const todoItems = response.results;

    return todoItems;
  } catch (errors) {
    console.error(errors);
  }
};



// const createTodoElement = item => {
//   const todoElement = document.createElement('li');

//   todoElement.id = item.id;
//   todoElement.appendChild(document.createTextNode(item.title));

//   todoElement.onclick = async event => await removeTodoElement(event, todoElement);

//   return todoElement;
// };


const updateTodoList = todoItems => {
  const todoList = document.querySelector('.image-container');

  if (Array.isArray(todoItems) && todoItems.length > 0) {
    todoItems.map(todoItem => {
      todoList.appendChild(createTodoElement(todoItem));
    });
  } else if (todoItems) {
    todoList.appendChild(createTodoElement(todoItems));
  }
};

const main = async () => {
  updateTodoList(await getMovieInfo());
};

main();


// const form = document.querySelector('form');

// form.addEventListener('submit', async event => {
//   event.preventDefault();

//   const title = document.querySelector('#new-todos__title').value;

//   const todo = {
//     userId: 1,
//     title: title,
//     completed: false
//   };

//   const submitTodoItem = await addTodoItem(todo);
//   updateTodoList(submitTodoItem);
// });

// ...

export const addTodoItem = async todo => {
  try {
    const response = await axios.post(`${BASE_URL}/todos`, todo);
    const newTodoItem = response.data;

    console.log(`Added a new Todo!`, newTodoItem);

    return newTodoItem;
  } catch (errors) {
    console.error(errors);
  }
};

// export const deleteTodoItem = async id => {
//   try {
//     const response = await axios.delete(`${BASE_URL}/todos/${id}`);
//     console.log(`Deleted Todo ID: `, id);

//     return response.data;
//   } catch (errors) {
//     console.error(errors);
//   }
// };


// const removeTodoElement = async (event, element) => {
//   event.target.parentElement.removeChild(element);
//   const id = element.id;

//   await deleteTodoItem(id);
// };

document.addEventListener('DOMContentLoaded', function () {
  const tabLinks = document.querySelectorAll('.tab-link');
  const tabContents = document.querySelectorAll('.tab-content');

  tabLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();

      tabLinks.forEach(link => link.classList.remove('active'));
      event.target.classList.add('active');

      const tabId = event.target.getAttribute('data-tab');
      tabContents.forEach(content => {
        content.style.display = content.id === `tab-${tabId}` ? 'block' : 'none';
      });

    });
  });

  // Activate the first tab by default
  tabLinks[0].click();
});