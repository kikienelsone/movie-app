import React from 'react';
import './Input.css';

export default class Input extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
    };
  }

  render() {
    return (
      <input
        className="input"
        value={this.state.inputValue}
        onChange={(e) => {
          this.setState({ inputValue: e.target.value });
          this.props.delay(e.target.value);
        }}
        placeholder="Type to search..."
      />
    );
  }
}
