import React from 'react';

import Movie from '../Movie/Movie';
import './MovieList.css';
// eslint-disable-next-line import/order
// eslint-disable-next-line import/order

export default class MovieList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ul className="movie-list">
          {this.props.data
            .map((item) => {
              return (
                <li className="movie-list__item" key={item.id}>
                  <Movie getRateMovie={this.props.getRateMovie} item={item} date={this.props.date} />
                </li>
              );
            })
            .slice(14)}
        </ul>
      </div>
    );
  }
}
