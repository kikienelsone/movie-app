import React from 'react';
import './Movie.css';
import { Rate } from 'antd';

// eslint-disable-next-line no-unused-vars
import { GenresConsumer } from '../Context/Context';

import img from './movieImg.png';

export default class Movie extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const posterAllPath = `https://image.tmdb.org/t/p/original${this.props.item.poster_path}`;
    const posterEnd = this.props.item.poster_path;
    const posterImg =
      posterAllPath.includes(posterEnd) && posterAllPath ? (
        <img className="movie-item__image" src={posterAllPath} alt="img" />
      ) : (
        <img className="movie-item__image" src={img} alt="img" />
      );
    const styles =
      this.props.item.vote_average <= 3 ? (
        <div style={{ border: '4px solid #E90000' }} className="movie-item__circle">
          {this.props.item.vote_average}
        </div>
      ) : this.props.item.vote_average > 3 && this.props.item.vote_average < 5 ? (
        <div style={{ border: '4px solid #E97E00' }} className="movie-item__circle">
          {this.props.item.vote_average}
        </div>
      ) : this.props.item.vote_average > 5 && this.props.item.vote_average < 7 ? (
        <div style={{ border: '4px solid #E9D100' }} className="movie-item__circle">
          {this.props.item.vote_average}
        </div>
      ) : (
        <div style={{ border: '4px solid #66E900' }} className="movie-item__circle">
          {this.props.item.vote_average}
        </div>
      );

    return (
      <GenresConsumer>
        {(genres) => (
          <div className="movie-item">
            {posterImg}
            <div className="movie-item__content">
              <h1 className="movie-item__header">{this.props.item.title}</h1>
              {styles}
              <p className="movie-item__date">{this.props.date(this.props.item.release_date)} </p>

              {genres.map((genre) => {
                if (genre.id === this.props.item.genre_ids[0]) {
                  // eslint-disable-next-line react/jsx-key
                  return <span className="movie-item__genre">{genre.name}</span>;
                }
                if (genre.id === this.props.item.genre_ids[1]) {
                  // eslint-disable-next-line react/jsx-key
                  return <span className="movie-item__genre">{genre.name}</span>;
                }
              })}

              <p className="movie-item__text">{this.props.item.overview}</p>
              <div className="movie-item__rate">
                <Rate allowHalf onChange={(e) => this.props.getRateMovie(e)} defaultValue={0} count={10} />
              </div>
            </div>
          </div>
        )}
      </GenresConsumer>
    );
  }
}
