import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DataFetcher extends Component {
  static propTypes = {
    // if you were fetching data from a server you could use fetchUrl to pass in whatever
    // endpoint you need to hit. Im just going to pass in the data i want "loaded" as a data prop.
    fetchUrl: PropTypes.string,
    data: PropTypes.any,
  }

  constructor() {
    super();
    this.state = {
      loading: false,
      data: null,
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.setState({ loading: true });
    setTimeout(() => this.setState({
      data: this.props.data,
      loading: false
    }), 2000);
  }

  render() {
    return this.props.children(this.state);
  }
}

export default DataFetcher;