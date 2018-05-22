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

