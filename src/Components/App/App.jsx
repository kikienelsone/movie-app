import './App.css';
import React from 'react';
import 'antd/dist/antd.css';
import { intlFormat } from 'date-fns';
import { Alert, Pagination, Spin, Tabs } from 'antd';
import { debounce } from 'lodash';

// eslint-disable-next-line import/order
import Input from '../Input/Input';

import MovieList from '../MovieList/MovieList';
import { GenresProvider } from '../Context/Context';

export default class App extends React.Component {
  constructor() {
    super();
    this.url = 'https://api.themoviedb.org/3/search/movie?api_key=e157b66a2125cee8a15a44803b9e8963';
    this.state = {
      data: {},
      genres: [],
      loading: true,
      error: false,
      rating: {},
    };

    this.pagination = this.pagination.bind(this);
    this.search = this.search.bind(this);
    this.getMovies = this.getMovies.bind(this);
    this.getGenres = this.getGenres.bind(this);
    this.getSession = this.getSession.bind(this);
  }

  getMovies(title = 'return', page = '1') {
    fetch(`${this.url}&query=${title}&page=${page}`).then((res) => {
      if (res.ok) {
        res.json().then((movie) => {
          this.setState({
            data: movie.results,
            loading: false,
          });
        });
      } else {
        this.setState({
          error: true,
          loading: false,
        });
      }
    });
  }

  componentDidMount() {
    this.getMovies();
    this.getGenres();
    this.getSession();
    this.createGuestSession();
  }

  getGenres() {
    fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=e157b66a2125cee8a15a44803b9e8963')
      .then((res) => res.json())
      .then((dataGenres) => {
        this.setState({
          genres: dataGenres.genres,
        });
      });
  }

  //нужно создать гостевую сессию чтоб получить токен
  createGuestSession() {
    fetch('https://api.themoviedb.org/3/authentication/guest_session/new?api_key=e157b66a2125cee8a15a44803b9e8963')
      .then((res) => res.json())
      .then((session) => localStorage.setItem('name', session.guest_session_id));
  }

  //я не понимаю зачем, но надо, вставить токен и еще раз что-то получить я уже забыла что
  getSession() {
    let guestSessionId = localStorage.getItem('name');
    fetch(
      `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=e157b66a2125cee8a15a44803b9e8963&language=en-US&sort_by=created_at.asc`
    )
      .then((res) => res.json())
      .then((session) => console.log(session));
  }

  //поставить сердечко фильму.
  // куда вставить токен?
  // или не токен?
  // ебать просто
  getRateMovie(value, movieId) {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=e157b66a2125cee8a15a44803b9e8963`, {
      method: 'post',
      value: value,
    })
      .then((res) => res.json())
      .then((rateMovie) => {
        console.log(rateMovie);
      });
  }

  pagination(page) {
    fetch(`${this.url}&query=return&page=${page}`).then((res) => {
      if (res.ok) {
        res.json().then((movie) => {
          this.setState({
            data: movie.results,
            loading: false,
          });
        });
      }
    });
    // this.getMovies(title, page);
  }

  search(event) {
    console.log(event);
    fetch(`${this.url}&query=${event}`)
      .then((res) => res.json())
      .then((movie) => {
        this.setState({ data: movie.results });
      });
    // this.getMovies(title);
  }

  date(day) {
    const result = intlFormat(
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
    return result;
  }

  render() {
    const delay = debounce(this.search, 1000);
    const { data, loading, error, genres } = this.state;
    const spinner = loading ? (
      <Spin tip="Loading...">
        <Alert message="Movies is coming" description="Further details about the context of this alert." type="info" />
      </Spin>
    ) : null;
    const { TabPane } = Tabs;
    const movieData = !loading ? <MovieList getRateMovie={this.getRateMovie} data={data} date={this.date} /> : null;
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
            <Pagination onChange={this.pagination} defaultCurrent={1} total={50} />
          </div>
        </div>
      </GenresProvider>
    );
  }
}
