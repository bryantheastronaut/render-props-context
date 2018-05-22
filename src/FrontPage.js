import React, { Fragment } from 'react';
import SingleItem from './SingleItem';

const FrontPage = ({data, loading, showDetails}) => {
  return (
    <div className="contentContainer">
      <h2 className="storeTitle">Cool Hat Store</h2>
      <div className="itemsList">
        {loading
          ? <p className="loadingText">Loading...</p>
          : data && data.map(item => (
            <div key={item.id} onClick={() => showDetails(item)}>
              <SingleItem key={item.id} item={item} />
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default FrontPage;

