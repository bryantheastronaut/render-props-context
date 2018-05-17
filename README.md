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
Now when we use the Name component, we can pass a _prop_ called _render_. The argument we recieve here is the name state. This is a great way to make a reusable component that accesses the same bit of state (say, a user object for example), without needing to render the same thing every time. 

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
