import './App.css';
import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { intlFormat } from 'date-fns';
import { Alert, Pagination, Spin, Tabs } from 'antd';
import { debounce } from 'lodash';

// eslint-disable-next-line import/order
import Input from '../Input/Input';

import MovieList from '../MovieList/MovieList';
import { GenresProvider } from '../Context/Context';

export default function App() {
  const url = 'https://api.themoviedb.org/3/search/movie?api_key=e157b66a2125cee8a15a44803b9e8963';

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [genres, setGenres] = useState([]);

  const getMovies = (title = 'return', page = '1') => {
    fetch(`${url}&query=${title}&page=${page}`).then((res) => {
      if (res.ok) {
        res.json().then((movie) => {
          setData(movie.results);
          setLoading(false);
        });
      } else {
        setLoading(false);
        setError(true);
      }
    });
  };

  useEffect(() => {
    getMovies();
    getGenres();
    createGuestSession();
    getSession();
  }, []);

  const getGenres = () => {
    fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=e157b66a2125cee8a15a44803b9e8963')
      .then((res) => res.json())
      .then((dataGenres) => {
        setGenres(dataGenres.genres);
      });
  };

  // нужно создать гостевую сессию чтоб получить токен
  const createGuestSession = () => {
    fetch('https://api.themoviedb.org/3/authentication/guest_session/new?api_key=e157b66a2125cee8a15a44803b9e8963')
      .then((res) => res.json())
      .then((session) => localStorage.setItem('name', session.guest_session_id));
  };

  //я не понимаю зачем, но надо, вставить токен и еще раз что-то получить я уже забыла что
  const getSession = () => {
    let guestSessionId = localStorage.getItem('name');
    fetch(
      `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=e157b66a2125cee8a15a44803b9e8963&language=en-US&sort_by=created_at.asc`
    )
      .then((res) => res.json())
      .then((session) => console.log(session));
  };

  //поставить сердечко фильму.
  // куда вставить токен?
  // или не токен?
  // ебать просто
  const getRateMovie = (value, movieId) => {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=e157b66a2125cee8a15a44803b9e8963`, {
      method: 'post',
      value: value,
    })
      .then((res) => res.json())
      .then((rateMovie) => {
        console.log(rateMovie);
      });
  };

  const pagination = (page) => {
    fetch(`${url}&query=return&page=${page}`).then((res) => {
      if (res.ok) {
        res.json().then((movie) => {
          setData(movie.results);
          setLoading(false);
        });
      }
    });
    // this.getMovies(title, page);
  };

  const search = (event) => {
    console.log(event);
    if (event) {
      fetch(`${url}&query=${event}`)
        .then((res) => res.json())
        .then((movie) => {
          setData(movie.results);
        });
    } else getMovies();

    // getMovies(event.target.value);
  };

  const date = (day) => {
    if (day) {
      return intlFormat(
        new Date(day),
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        },
        {
          locale: 'en',
        }
      );
    } else return 'June 21, 1985';
  };

  const delay = debounce(search, 300);
  const spinner = loading ? (
    <Spin tip="Loading...">
      <Alert message="Movies is coming" description="Further details about the context of this alert." type="info" />
    </Spin>
  ) : null;
  const { TabPane } = Tabs;
  const movieData = !loading ? <MovieList getRateMovie={getRateMovie} data={data} date={date} /> : null;
  if (error) {
    return <Alert message="OMG" type="info" closeText="Close It Now!" />;
  }

  return (
    <GenresProvider value={genres}>
      <div className="app">
        <div className="app__tabs">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Search" key="1">
              <div className="app__input">
                <Input delay={delay} />
              </div>
            </TabPane>
            <TabPane tab="Rate" key="2"></TabPane>
          </Tabs>
        </div>
        {movieData}
        {spinner}
        <div className="app__pagination">
          <Pagination onChange={pagination} defaultCurrent={1} total={50} />
        </div>
      </div>
    </GenresProvider>
  );
}
