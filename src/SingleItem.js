import React from 'react';

const SingleItem = ({item}) => (
  <div className="singleItemContainer">
    <h2>{item.name}</h2>
    <p>{item.details}</p>
  </div>
);

export default SingleItem;
