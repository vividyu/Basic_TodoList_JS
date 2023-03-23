import 'regenerator-runtime/runtime';
import axios from 'axios';
import { consumers } from 'stream';
const crypto = require('crypto');

const api_key = "2f39ac8abf607fbbc583ce393c0f56f3";
const BASE_URL = `https://api.themoviedb.org/3/trending/movie/week?`;
const CONFIG_URL = `https://api.themoviedb.org/3/configuration?api_key=${api_key}`;
const LOADING_GIF = 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif';
const LIKE_ICON = 'https://cdn-icons-png.flaticon.com/512/833/833472.png';

const getImgUrlPrefix = async (poster_sz = 4, bg_sz = 2, logo_sz = 0) => {
  try {
    const config = await axios.get(CONFIG_URL);
    const cfgdata = config.data.images;
    //console.log(cfgdata);//test log

    const posterUrlPrefix = cfgdata.secure_base_url + cfgdata.poster_sizes[poster_sz];
    const bgUrlPrefix = cfgdata.secure_base_url + cfgdata.backdrop_sizes[bg_sz];
    const logoUrlPrefix = cfgdata.secure_base_url + cfgdata.logo_sizes[logo_sz];

    //console.log(bgUrlPrefix);

    return { posterUrlPrefix, bgUrlPrefix, logoUrlPrefix };

  } catch (errors) {
    console.error(errors);
  }
};

const generatePosterFrame = async (page = 1) => {
  try {
    const imageContainer = document.querySelector('.image-container');
    imageContainer.innerHTML = '';

    const listUrl = `${BASE_URL}page=${page}&api_key=${api_key}`;
    const response = await axios.get(listUrl);
    //console.log(response);//test log

    const res = response.data.results;
    const total_pages = response.data.total_pages;
    const total_results = response.data.total_results;

    res.forEach(detail => {
      const item = document.createElement('div');
      const image = document.createElement('img');
      const title = document.createElement('p');
      const release_date = document.createElement('p');
      const like_button = document.createElement('button');
      const like_icon = document.createElement('img');

      item.className = `movie-item`;


      like_icon.src = LIKE_ICON;
      image.classList.add('image');
      like_button.className = `likebtn`;

      image.src = LOADING_GIF;
      image.classList.add('image');
      image.className = `img_loading`;

      title.textContent = '';
      title.className = `movie-title`;

      release_date.textContent = '';
      release_date.className = `release-date`;

      imageContainer.appendChild(item);
      item.appendChild(like_button);
      like_button.appendChild(like_icon);
      item.appendChild(image);
      item.appendChild(title);
      item.appendChild(release_date);
    })

    return { total_pages, total_results };

  } catch (errors) {
    console.error(errors);
  }
};

const updateMovieInfo = async (page = 1) => {
  try {
    const imageContainer = document.querySelector('.image-container');
    //imageContainer.innerHTML = '';

    const poster_sz = 4;//w500
    const { posterUrlPrefix } = await getImgUrlPrefix(poster_sz);

    const listUrl = `${BASE_URL}page=${page}&api_key=${api_key}`;
    const response = await axios.get(listUrl);
    //console.log(response);//test log

    const res = response.data.results;
    const total_pages = response.data.total_pages;
    const total_results = response.data.total_results;

    const len = res.length;
    for (let i = 0; i < len; i++) {
      const imgUrl = res[i].poster_path;
      const movieid = res[i].id;
      const movietitle = res[i].title;
      const movie_release_date = res[i].release_date;
      const movieItemAll = document.querySelectorAll('.movie-item');
      const poster = movieItemAll[i].querySelector('img[class^="img"]');
      if (poster == null) console.log("null at" + i);//test log
      const title = movieItemAll[i].querySelector('.movie-title');
      const release_date = movieItemAll[i].querySelector('.release-date');
      const likebtn = movieItemAll[i].querySelector('button[class^="likebtn"]');

      poster.src = posterUrlPrefix + imgUrl;
      poster.className = `img${movieid}`;
      likebtn.className = `likebtn${movieid}`;

      title.textContent = movietitle;
      release_date.textContent = movie_release_date;
    }
    return { total_pages, total_results };
  } catch (errors) {
    console.error(errors);
  }
};


const pagination = async () => {
  try {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const pageNum = document.getElementById('page-num');
    const TotalPages = document.getElementById('total-pages');
    const TotalRes = document.getElementById('total-results');

    let page = 1;
    //get page 1 by default
    pageNum.textContent = page;

    const { total_pages, total_results } = await updateMovieInfo(page);
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
      await updateMovieInfo(page);
    });

    // Add event listener to the next button
    nextButton.addEventListener('click', async () => {
      page++;
      pageNum.textContent = page;
      prevButton.disabled = page <= 1;
      nextButton.disabled = page >= total_pages;
      await updateMovieInfo(page);
    });
  } catch (errors) {
    console.error(errors);
  }

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

const listenPoster = async () => {
  try {
    // const imageContainer = document.querySelector('.image-container');
    // const posterAll = imageContainer.querySelectorAll('img');
    const posterAll = document.querySelectorAll('img[class^="img"]');

    posterAll.forEach(poster => {
      poster.addEventListener('click', async () => {
        const movid = poster.className.replace(/\D/g, '');
        //console.log(movid);
        await showDetails(movid);
      });
    });
  } catch (errors) {
    console.error(errors);
  }
}

const showDetails = async (movid) => {
  try {
    const MOV_URL = `https://api.themoviedb.org/3/movie/${movid}?api_key=${api_key}&language=en-US`;
    const bgContainer = document.querySelector('.bg-container');
    const bgContent = document.querySelector('.bg-content');
    const poster = document.querySelector('.poster-bg');

    const movie_title = document.querySelector('.title-bg');
    const movie_genre = document.querySelector('.tags-bg');
    const movie_inro = document.querySelector('.intro-bg');
    const movie_producer = document.querySelector('.producer-bg');

    bgContainer.addEventListener('click', async () => {
      bgContainer.style.display = 'none';
      movie_genre.innerHTML = '';
      movie_producer.innerHTML = '';
    });

    const response = await axios.get(MOV_URL);
    //console.log(response.data); //test log

    let poster_sz = 4;
    let bg_sz = 2;
    const { posterUrlPrefix, bgUrlPrefix, logoUrlPrefix } = await getImgUrlPrefix(poster_sz, bg_sz);

    const posterUrl = posterUrlPrefix + response.data.poster_path;
    const bgUrl = bgUrlPrefix + response.data.backdrop_path;

    bgContainer.style.display = 'flex';
    bgContent.style.backgroundImage = `url(${bgUrl})`;
    poster.setAttribute('src', posterUrl);

    movie_title.textContent = `${response.data.original_title}(${response.data.release_date.substr(0, 4)})`;
    movie_inro.textContent = response.data.overview;

    const genreArr = response.data.genres;
    const prodrArr = response.data.production_companies;

    //console.log(genreArr); //test log
    //console.log(prodrArr); //test log

    genreArr.forEach(genre => {
      const genre_id = genre.id;
      const genre_name = genre.name;

      const hash = crypto.createHash('sha256').update(genre_name).digest('hex');
      const color = '#' + hash.substring(0, 6);

      const li = document.createElement("li");
      li.style.backgroundColor = color;
      const text = document.createTextNode(genre_name);
      li.appendChild(text);
      movie_genre.appendChild(li);
    });

    prodrArr.forEach(prodr => {

      const prodr_id = prodr.id;
      const prodr_name = prodr.name;
      const logo_path = prodr.logo_path;
      if (logo_path == null) {
        return;
      }
      const li = document.createElement("li");
      const logo = document.createElement('img');
      logo.src = logoUrlPrefix + logo_path;
      li.appendChild(logo);
      movie_producer.appendChild(li);
    });


  } catch (errors) {
    console.error(errors);
  }
}

const main = async () => {
  loadTabs();
  await generatePosterFrame();
  await updateMovieInfo();
  await pagination();
  await listenPoster();
}
main();


