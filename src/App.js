import React, { Fragment, Component } from 'react';
import Modal from 'react-modal';
import { CartStore } from './cartStore';
import FrontPage from './FrontPage';
import ItemDetails from './ItemDetails';
import { SAMPLE_DATA } from './data';
import './App.css';
import DataFetcher from './DataFetcher';

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

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
      currentlyViewingItem: null,
    })
  }

  render() {
    return (
      <Fragment>
        <DataFetcher data={SAMPLE_DATA}>
          {({ loading, data }) => {
            return loading
              ? <p className="loadingText">Loading...</p>
              : <FrontPage
                data={data}
                showDetails={this.showDetails}
              />
          }}
        </DataFetcher>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
        >
          <ItemDetails
            shouldFetch={!!this.state.currentlyViewingItem}
            closeModal={this.closeModal}
            item={this.state.currentlyViewingItem}
          />
        </Modal>
      </Fragment>
    );
  }
}

export default App;
