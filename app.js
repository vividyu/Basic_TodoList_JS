import 'regenerator-runtime/runtime';
import axios from 'axios';
import { consumers } from 'stream';

const api_key = "2f39ac8abf607fbbc583ce393c0f56f3";
const BASE_URL = `https://api.themoviedb.org/3/trending/movie/week?`;
const CONFIG_URL = `https://api.themoviedb.org/3/configuration?api_key=${api_key}`;

const getImgUrlPrefix = async (imgsize) => {
  try {
    const config = await axios.get(CONFIG_URL);
    const cfgdata = config.data.images;
    const imgUrlPrefix = cfgdata.base_url + cfgdata.poster_sizes[imgsize];

    return imgUrlPrefix;

  } catch (errors) {
    console.error(errors);
  }
};

const getMovieInfo = async (page) => {
  try {
    const imageContainer = document.querySelector('.image-container');
    imageContainer.innerHTML = '';

    const imgsize = 4;//w500
    const imgUrlPrefix = await getImgUrlPrefix(imgsize);

    const listUrl = `${BASE_URL}page=${page}&api_key=${api_key}`;
    const response = await axios.get(listUrl);
    console.log(response);

    const res = response.data.results;
    const total_pages = response.data.total_pages;
    const total_results = response.data.total_results;

    res.forEach(detail => {
      const imgUrl = detail.poster_path;
      const movieid = detail.id;
      const movietitle = detail.title;
      const movie_release_date = detail.release_date;

      const item = document.createElement('div');
      const image = document.createElement('img');
      const title = document.createElement('p');
      const release_date = document.createElement('p');

      item.className = `movie-item`;

      image.src = imgUrlPrefix + imgUrl;
      image.classList.add('image');
      image.className = `img${movieid}`;

      title.textContent = movietitle;
      title.className = `movie-title`;

      release_date.textContent = movie_release_date;
      release_date.className = `release-date`;

      imageContainer.appendChild(item);
      item.appendChild(image);
      item.appendChild(title);
      item.appendChild(release_date);
    })

    return { total_pages, total_results };

  } catch (errors) {
    console.error(errors);
  }
};


const pagination = async () => {
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');
  const pageNum = document.getElementById('page-num');
  const TotalPages = document.getElementById('total-pages');
  const TotalRes = document.getElementById('total-results');

  let page = 1;
  //get page 1 by default
  pageNum.textContent = page;

  const { total_pages, total_results } = await getMovieInfo(page);
  TotalPages.textContent = total_pages;
  TotalRes.textContent = total_results;

  prevButton.addEventListener('click', async () => {
    page--;
    if (page < 1) {
      throw new Error("page error: page=" + page);
    }
    pageNum.textContent = page;
    prevButton.disabled = page <= 1;
    nextButton.disabled = page >= 1000;
    await getMovieInfo(page);
  });

  // Add event listener to the next button
  nextButton.addEventListener('click', async () => {
    page++;
    pageNum.textContent = page;
    prevButton.disabled = page <= 1;
    nextButton.disabled = page >= total_pages;
    await getMovieInfo(page);
  });
}

function loadTabs() {
  const tabctrl = document.addEventListener('DOMContentLoaded', function () {
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
}

const main = async () => {
  loadTabs();
  pagination();
}
main();


