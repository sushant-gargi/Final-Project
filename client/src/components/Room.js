import React, { useState } from "react";
import { Modal, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

function Room({ room, fromDate, toDate }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const StarRating = ({ value }) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < value) {
        stars.push(<span key={i} style={{color: '#FFD700'}}>&#9733;</span>); // filled star
      } else {
        stars.push(<span key={i} style={{color: '#DDDDDD'}}>&#9733;</span>); // empty star
      }
    }
    return <div style={{fontSize: '20px', display: 'inline-block'}}>{stars}</div>;
  };
  
  
  return (
    <div className="row bs">
      <div className="col-md-2">
        <img src={room.imageurls[0]} className="smallimg" alt="" />
      </div>
      <div className="col-md-6">
        <h1>{room.name}</h1>
        <b>
          {/* <p>Max Count: {room.maxcount}</p>
          <p>Phone Number: {room.phonenumber}</p> */} 

          <p>
            <i class="fas fa-home"></i>  Type: {room.type.toUpperCase()}
          </p>
          <p>
            <i class="fas fa-map-marker-alt"></i> Address: {room.address}
          </p>
          <p style={{ color: "green" }}>
            <i className="fas fa-check-circle"></i> Free Cancellation
          </p>
          <p>
            <i className="fas fa-wifi"></i> 24/7 WiFi Available
          </p>
        </b>

        <div style={{ float: "right" }}>
          {fromDate && toDate && (
            <Link to={`/book/${room._id}/${fromDate}/${toDate}`}>
              <button className="btn btn-primary m-2">Book Now</button>
            </Link>
          )}

          <button className="btn btn-primary" onClick={handleShow}>
            View Detail
          </button>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} size="lg">
  <Modal.Header closeButton>
    <Modal.Title style={{fontFamily: 'Arial, sans-serif', color: '#333', textAlign: 'center'}}>
      {room.name}
    </Modal.Title>
  </Modal.Header>
  <Modal.Body style={{fontFamily: 'Arial, sans-serif', color: '#555'}}>
    {room.image && <img src={room.image} alt={room.name} style={{width: '100%', height: 'auto'}} />}
    <p>{room.description}</p>
    <p><strong>Max Count:</strong> {room.maxcount}</p>
    <p><strong>Phone Number:</strong> {room.phonenumber}</p>
    <p><strong>Address:</strong> {room.address}</p>
    <p><strong>Rating:</strong> <StarRating value={5} /></p> 
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Close
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
}

export default Room;
