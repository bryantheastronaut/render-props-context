# Render Props and You!

Hi all! I'm back to tell ya'll about a new thing I've been playing with. If you keep up with the React world, you've probably heard some [very]()[well known]() [people]() talking about Render Props. Today we will dive into them a bit and see how they can make your components simpler and more reusable!

## WTF is a render prop?

A render prop is exactly what it sounds like: a prop you pass to a component that tells it what (and/or how) to render. There are a bunch of libraries that take advantage of this pattern (react-motion, react-router, even React's new [context api]()) use them.

## WTF does it look like?

A simple example of a render prop could look something like this:

```
class Wrapper extends Component {
  constructor() {
    super();
    this.state = { name: 'Bryan' };
  }
  render() {
    return this.props.render(this.state.name);
  }
}

const Name = () => (
  <Wrapper render={(name) => <h2>Hi, {name}</h2>} />
);

```
Now when we use the Name component, we can pass a _prop_ called _render_. The argument we recieve here is the name state. This is a great way to make a reusable component that accesses the same bit of state (say, a users name, for example), without needing to render the same thing every time.

## Functions as children

It's easy to forget, but React really is just Javascript, and `this.props.children` is no different. Using the same pattern as above, we can refactor this a bit more to make it even easier to reason about and read. Instead of passing a prop called render, what if we just expected the propsl children to be a function? That means the child being rendered could still have access to the state that is in the wrapper, too!

```
class Wrapper extends Component {
  constructor() {
    super();
    this.state = { name: 'Bryan' };
  }
  render() {
    return this.props.children(this.state.name);
  }
}

const Name = () => (
  <Wrapper>
    {(name) => <h2>Hi {name}</h2>}
  </Wrapper>
);
```

Hopefully you are beginning to see how powerful this pattern can be for removing duplicitive code from your projects. Let's work through something a bit bigger to see how you might use it in a real project, not just a name printer ;)

## A Shopping Cart example

In this example, we will make a small shop. There will be a component we will use the above pattern for to fetch data and show a spinner. We may even use the new React Context API to create a global store and persist the data across the app!

Thinking through this application, we will need a front page which contains all the items in our store. Seeing as we are just getting this store off the ground,  there will only be 4 items in this store. Perhaps we are selling silly hats.

Clicking on one of these items should open up a details modal. This could contain details of each hat, and a button to add to your cart.

Our cart will just be a context store we create, which will be a great intro to the new context API as well as handle our state management.

Finally, we will need a wrapper component which will fetch our data for us from our server We wont be using real data in this example, we can get away with promises and timeouts to show how it will work. You can swap these calls out with network calls if you'd like :)


Here we have the components without any frills, just plain old React state and rendering with JSX like usual.

```
// src/App.js
import React, { Fragment, Component } from 'react';
import Modal from 'react-modal';
import { CartStore } from './cartStore';
import FrontPage from './FrontPage';
import ItemDetails from './ItemDetails';
import { SAMPLE_DATA } from './data';
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

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
      currentlyViewingItem: null,
    })
  }

  render() {
    return (
      <Fragment>
        <FrontPage
      	  data={SAMPLE_DATA}
	        showDetails={this.showDetails}
	      />
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
        >
          <ItemDetails
            closeModal={this.closeModal}
            item={this.state.currentlyViewingItem}
          />
        </Modal>
      </Fragment>
    );
  }
}

export default App;

```

```
// src/FrontPage.js
import React, { Fragment } from 'react';
import SingleItem from './SingleItem';

const FrontPage = ({data, loading, showDetails}) => {
  if (loading) {
    return <p className="loadingText">Loading...</p>;
  }
  return (
    <div>
      <h2 className="storeTitle">Cool Hat Store</h2>
      <div className="itemsList">
        {data && data.map(item => (
      	  <div onClick={() => showDetails(item)}>
            <SingleItem key={item.id} item={item} />
	        </div>
	      ))}
      </div>
    </div>
  );
}

export default FrontPage;

```

```
// src/ItemDetails.js
import React, { Component } from 'react';

const ItemDetails = (props) => {
  if (!props.item) return null;
	return (
    <div className="detailsModal">
      <div className="modalContent">
        <h2>{props.item.name}</h2>
        <p>{props.item.details}</p>
      </div>
      <div className="modalFooter">
        <button
          className="closeButton"
          onClick={props.closeModal}
        >Close</button>
      </div>
    </div>
	)
}

export default ItemDetails;

```

```
// src/SingleItem.js
import React from 'react';

const SingleItem = ({item}) => (
  <div className="singleItemContainer">
    <h2>{item.name}</h2>
    <p>{item.details}</p>
  </div>
);

export default SingleItem;
```

```
// src/data.js
export const SAMPLE_DATA = [
  {id: 1, name: 'Fedora', details: 'A classic. Always ready to talk about coffee.'},
  {id: 2, name: 'Bowler', details: 'The king of cool.'},
  {id: 3, name: 'Crown', details: 'Real rulers wear crowns.'},
  {id: 4, name: 'Tophat', details: 'Forever a fancy-folk.'},
];

```

// TODO: add css file at the end when its done.

A bit of cool stuff going on here -- We are using a Fragment in _App.js_. This is a utility of React which lets you wrap components with something to ensure there is only one child, but will not render anything to the DOM. This saves us from using unnecessary div's or other wrapper elements to keep our code cleaner.

Other than that, this is a pretty simple App. We call FrontPage.js which maps over whatever data we pass to it, rendering each SingleItem containing info on it. Clicking on a SingleItem will open up the ItemDetails modal, where we will (eventually) be fetching more data to load asyncronously.

## Writing a DataFetcher component

Now the fun begins! What we want to do is write a wrapper component we can use to fetch data (normally from a server, but we will be faking it for this example). This component can track when the data is loading, handle passing the data down once fetched. This is really cool because once we write it, we can use it wherever we want! We can use this same component to load the list of our data we are passing into FrontPage as we use with ItemDetails!

Wow!

First we just want to make a component which takes a function as a child and renders it, passing in the relevant bits of state. These bits of state be a loading boolean and whatever shape your data will take (probably easiest if its an object). We will also write a fake fetch method that sets hardcoded data after a timeout (to fake an async call). We wont do it here, but you could also catch any errors during the fetch and pass them along with the loading and data props for nice, consistent error handling.

```
// src/DataFetcher.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DataFetcher extends Component {
  static propTypes = {
    // if you were fetching data from a server you could use fetchUrl to pass in whatever
    // endpoint you need to hit. Im just going to pass in the data i want "loaded" as a data prop.
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

```

Now, we can use this same data fetcher in our FrontPage component AND in ItemDetails! Even though they are fetching different data (and possibly even differently shaped data!), we can handle all that logic here and make the components that use that data simpler. Rearranging App.js, we can wrap the _FrontPage_ in _DataFetcher_ like so:

```
// src/App.js
...
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
// ...
```

Changing FrontPage to be returned from the function depending on the value of loading is a very powerful pattern that can greatly increase code readability and code reusability. Looking at this component, I can safely reason about that `Loading...` will be returned if the data is being fetched, or else the FrontPage component will be rendered.

We can even change only a small part of a component based on the state of the data fetch. In _ItemDetails_,

```
// src/ItemDetails.js
import React, { Fragment, Component } from 'react';
import DataFetcher from './DataFetcher';

const FAKE_DATA = {
  additionalDetails: 'A cool photo',
  imgUrl: 'https://picsum.photos/250',
};

const ItemDetails = (props) => {
  if (!props.item) return null;
  return (
    <DataFetcher data={FAKE_DATA}>
      {({ loading, data }) => {
        return (
          <div className="detailsModal">
            <div className="modalContent">
              <h2>{props.item.name}</h2>
              <p>{props.item.details}</p>
              {loading
                ? <p className="loadingText">Loading...</p>
                : data &&
                  <img
                    src={data.imgUrl}
                    alt={data.additionalDetails}
                  />
              }
            </div>
            <div className="modalFooter">
              <button
                className="closeButton"
                onClick={props.closeModal}
              >Close</button>
            </div>
          </div>
        )
      }}
    </DataFetcher>
  );
}

export default ItemDetails;

```

Above, we are still rendering