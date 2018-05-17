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

