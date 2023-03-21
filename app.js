import 'regenerator-runtime/runtime';
import axios from 'axios';
import { consumers } from 'stream';

const api_key = "2f39ac8abf607fbbc583ce393c0f56f3";
const BASE_URL = `https://api.themoviedb.org/3/trending/movie/week?`;
const CONFIG_URL = `https://api.themoviedb.org/3/configuration?api_key=${api_key}`;

const getImgUrlPrefix = async () => {
  try {
    const config = await axios.get(CONFIG_URL);
    const cfgdata = config.data.images;
    const imgUrlPrefix = cfgdata.base_url + cfgdata.poster_sizes[4];

    return imgUrlPrefix;

  } catch (errors) {
    console.error(errors);
  }
};

const getMovieInfo = async (page) => {
  try {
    const imageContainer = document.querySelector('.image-container');
    imageContainer.innerHTML = '';

    const imgUrlPrefix = await getImgUrlPrefix();

    const listUrl = `${BASE_URL}page=${page}&api_key=${api_key}`;
    const response = await axios.get(listUrl);

    const res = response.data.results;
    const total_pages = response.data.total_pages;
    const total_results = response.data.total_results;

    res.forEach(detail => {
      const imgUrl = detail.poster_path;
      const image = document.createElement('img');
      image.src = imgUrlPrefix + imgUrl;
      image.classList.add('image');
      imageContainer.appendChild(image);
    })

    return { total_pages, total_results };

  } catch (errors) {
    console.error(errors);
  }
};


const pagination = async () => {
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');

  let page = 1;
  //get page 1 by default
  const { total_pages, total_results } = await getMovieInfo(page);

  prevButton.addEventListener('click', async () => {
    page--;
    if (page < 1) alert("page error: page=" + page);
    prevButton.disabled = page <= 1;
    nextButton.disabled = page >= 1000;
    await getMovieInfo(page);
  });

  // Add event listener to the next button
  nextButton.addEventListener('click', async () => {
    page++;
    prevButton.disabled = page <= 1;
    nextButton.disabled = page >= total_pages;
    await getMovieInfo(page);
  });
}

const tab = document.addEventListener('DOMContentLoaded', function () {
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

const main = async () => {
  pagination();
}
main();


