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
```

```
// src/FrontPage.js
import React, { Fragment } from 'react';
import SingleItem from './SingleItem';

const FrontPage = ({data, isLoading, showDetails}) => {
  if (isLoading) {
    return <p className="loadingText">Loading...</p>;
  }
  return (
    <div>
      <h2 className="storeTitle">Cool Hat Store</h2>
      <div className="itemsList">
        {data.map(item => (
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
import Modal from 'react-modal';

const ItemDetails = (props) => {
  if (!props.item) return null;
	return (
		<Modal
			isOpen={props.modalIsOpen}
			onRequestClose={props.closeModal}
		>
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
		</Modal>
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
// src/cartStore.js
import React from 'react';

export const CartStore = React.createContext();

```

```
// src/data.js
export const data = [
  {id: 1, name: 'Fedora', details: 'A classic. Always ready to talk about coffee.'},
  {id: 2, name: 'Bowler', details: 'The king of cool.'},
  {id: 3, name: 'Crown', details: 'Real rulers wear crowns.'},
  {id: 4, name: 'Tophat', details: 'Forever a fancy-folk.'},
];

```
