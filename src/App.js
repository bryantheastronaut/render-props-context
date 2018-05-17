import React, { Fragment, Component } from 'react';
import { CartStore } from './cartStore';
import FrontPage from './FrontPage';
import ItemDetails from './ItemDetails';
import { data } from './data';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      cart: [],
      modalIsOpen: false,
      currentlyViewingItem: null
    };
  }

  showDetails = (item) => {
    this.setState({ modalIsOpen: true, currentlyViewingItem: item });
  }

  render() {
    return (
      <CartStore.Provider value={this.state}>
        <FrontPage
      	  data={data}
	        isLoading={false}
	        showDetails={this.showDetails}
	      />
        <ItemDetails
          item={this.state.currentlyViewingItem}
	        modalIsOpen={this.state.modalIsOpen}
	        closeModal={() => this.setState({ modalIsOpen: false, currentlyViewingItem: null })}
	      />
      </CartStore.Provider>
    );
  }
}

export default App;
