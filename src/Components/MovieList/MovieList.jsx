import React from 'react';

import Movie from '../Movie/Movie';
import './MovieList.css';
// eslint-disable-next-line import/order
// eslint-disable-next-line import/order

export default function MovieList({ data, date, getRateMovie }) {
  return (
    <div>
      <ul className="movie-list">
        {data
          .map((item) => {
            return (
              <li className="movie-list__item" key={item.id}>
                <Movie getRateMovie={getRateMovie} item={item} date={date} />
              </li>
            );
          })
          .slice(14)}
      </ul>
    </div>
  );
}
