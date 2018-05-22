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
