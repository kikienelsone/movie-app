import React from 'react';
import './Movie.css';
import { Rate } from 'antd';

// eslint-disable-next-line no-unused-vars
import { GenresConsumer } from '../Context/Context';

import img from './movieImg.png';

export default function Movie(props) {
  const posterAllPath = `https://image.tmdb.org/t/p/original${props.item.poster_path}`;
  const posterEnd = props.item.poster_path;
  const posterImg =
    posterAllPath.includes(posterEnd) && posterAllPath ? (
      <img className="movie-item__image" src={posterAllPath} alt="img" />
    ) : (
      <img className="movie-item__image" src={img} alt="img" />
    );
  const styles =
    props.item.vote_average <= 3 ? (
      <div style={{ border: '4px solid #E90000' }} className="movie-item__circle">
        {props.item.vote_average}
      </div>
    ) : props.item.vote_average > 3 && props.item.vote_average < 5 ? (
      <div style={{ border: '4px solid #E97E00' }} className="movie-item__circle">
        {props.item.vote_average}
      </div>
    ) : props.item.vote_average > 5 && props.item.vote_average < 7 ? (
      <div style={{ border: '4px solid #E9D100' }} className="movie-item__circle">
        {props.item.vote_average}
      </div>
    ) : (
      <div style={{ border: '4px solid #66E900' }} className="movie-item__circle">
        {props.item.vote_average}
      </div>
    );

  return (
    <GenresConsumer>
      {(genres) => (
        <div className="movie-item">
          {posterImg}
          <div className="movie-item__content">
            <h1 className="movie-item__header">{props.item.title}</h1>
            {styles}
            <p className="movie-item__date">{props.date(props.item.release_date)} </p>

            {genres.map((genre) => {
              if (genre.id === props.item.genre_ids[0]) {
                // eslint-disable-next-line react/jsx-key
                return <span className="movie-item__genre">{genre.name}</span>;
              }
              if (genre.id === props.item.genre_ids[1]) {
                // eslint-disable-next-line react/jsx-key
                return <span className="movie-item__genre">{genre.name}</span>;
              }
            })}

            <p className="movie-item__text">{props.item.overview}</p>
            <div className="movie-item__rate">
              <Rate allowHalf onChange={(e) => props.getRateMovie(e)} defaultValue={0} count={10} />
            </div>
          </div>
        </div>
      )}
    </GenresConsumer>
  );
}
