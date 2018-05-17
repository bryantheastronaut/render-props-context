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

