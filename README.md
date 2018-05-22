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

It's easy to forget, but React really is just Javascript, and `this.props.children` is no different. Using the same pattern as above, we can refactor this a bit more to make it even easier to reason about and read. Instead of passing a prop called render, what if we just expected the props children to be a function? That means the child being rendered could still have access to the state that is in the wrapper, too! Children being a function is a render prop too. They don't need to be explicitly called render, only used to render the component.

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

In this example, we will make a small shop. Perhaps we are selling silly hats? There will be a component we will use the above pattern for to fetch data and set our loading state.

Thinking through this application, we will need a front page which contains all the items in our store. Seeing as we are just getting this store off the ground, there will only be 4 items in this store.

Clicking on one of these items should open up a details modal. This could contain details of each hat, and maybe a picture.

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
    <div className="contentContainer">
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

And some styles to make it look a little nicer:

```
// App.css
body {
	margin: 0;
	padding: 0;
	font-family: sans-serif;
	background-color: #2ad;
}

.storeTitle {
	text-align: center;
	background-color: #f9f9f9;
}

.contentContainer {
	background-color: #f9f9f9;
	max-width: 900px;
	padding: 20px;
	margin: 20px auto;
	border-radius: 10px;
}

.itemsList {
	display: flex;
	justify-content: center;
	flex-flow: row wrap;
	padding: 15px 25px;
	max-width: 900px;
	margin: 0 auto;

}

.singleItemContainer {
	min-width: 300px;
	margin: 10px;
	border: 1px solid #c9c9c9;
	flex: 1;
	padding: 10px 20px;
	text-align: center;
	cursor: pointer;
	border-radius: 2px;
}

.singleItemContainer:hover {
	background-color: #f6f6f6;
	box-shadow: 2px 2px 2px #ddd;
	border-color: #f1f1f1;
}

.detailsModal {
  height: 100%;
	display: flex;
  flex-flow: column nowrap;
}

.loadingText {
	text-align: center;
	color: #444;
	padding-top: 30px;
}

.modalContent {
	flex: 1;
  padding-bottom: 50px;
	overflow: auto;
	display: flex;
	align-items: center;
	flex-flow: column nowrap;
}

.modalContent img {
	align-self: center;
	padding-top: 30px;
}

.modalFooter {
  align-self: center;
}

.closeButton {
  border: 1px solid #0074d9;
  background-color: #1185ea;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: 600;
  font-size: 14px;
}

.closeButton:hover {
  background-color: #0074d9;
  cursor: pointer;
}

```

A bit of cool stuff going on here -- We are using a Fragment in _App.js_. This is a utility of React which lets you wrap components with something to ensure there is only one child, but will not render anything to the DOM. This saves us from using unnecessary div's or other wrapper elements to keep our code cleaner.

Other than that, this is a pretty simple application. We call FrontPage.js which maps over whatever data we pass to it, rendering each SingleItem containing info on it. Clicking on a SingleItem will open up the ItemDetails modal, where we will (eventually) be fetching more data to load asyncronously.

## Writing a DataFetcher component

Now the fun begins! What we want to do is write a wrapper component we can use to fetch data (normally from a server, but we will be faking it for this example). This component can track when the data is loading, handle passing the data down once fetched. This is really cool because once we write it, we can use it wherever we want! We can use this same component to load the list of our data we are passing into FrontPage as we use with ItemDetails!

Wow!

First we just want to make a component which takes a function as a child and renders it, passing in the relevant bits of state. These bits of state be a loading boolean and whatever shape your data will take. We will also write a fake fetch method that sets hardcoded data after a timeout (to fake an async call). We wont do it here, but you could also catch any errors during the fetch and pass them along with the loading and data props for nice, consistent error handling.

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
    {({ loading, data }) => (
        <FrontPage
          loading={loading}
          data={data}
          showDetails={this.showDetails}
        />
    )}
  </DataFetcher>
// ...
```

Changing FrontPage to be returned from the function depending on the value of loading is a very powerful pattern that can greatly increase code readability and code reusability.
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

Above, we are still rendering the title and details of each item, even when we are in the middle of getting new data from our server. Once the data loads, we replace the "Loading..." section with our brand new data!

This pattern could continue to be used all across the app. If you have ever written components with quite a few similar methods, this may be an excellent sign to try to make one component more generalizable, like we did above.

-----------

Hopefully this little writeup helped clear up what Render Props are, and gave you a good idea of how they may benefit your app and/or codebase. Let me know if there is anything I can clarify, explain more, or something else you'd like me to go over! You can reach out in the comments below or on twitter at @spacebrayn


<3