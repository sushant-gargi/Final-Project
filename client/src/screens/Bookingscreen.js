import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import Error from "../components/Error";

function BookingDetails({ user, fromdate, todate, maxcount }) {
  return (
    <div className="booking-details">
      <h2>Booking Details</h2>
      <hr />
      <dl className="row">
        <dt className="col-sm-4">Name:</dt>
        <dd className="col-sm-8">{user.name}</dd>

        <dt className="col-sm-4">Email:</dt>
        <dd className="col-sm-8">{user.email}</dd>

        <dt className="col-sm-4">Phone:</dt>
        <dd className="col-sm-8">{user.phone}</dd>

        <dt className="col-sm-4">From Date:</dt>
        <dd className="col-sm-8">{fromdate}</dd>

        <dt className="col-sm-4">To Date:</dt>
        <dd className="col-sm-8">{todate}</dd>

        <dt className="col-sm-4">Max Count:</dt>
        <dd className="col-sm-8">{maxcount}</dd>
      </dl>
    </div>
  );
}

function AmountDetails({ totalDays, rentPerDay, totalAmount }) {
  return (
    <div className="amount-details">
      <h2>Amount</h2>
      <hr />
      <dl className="row">
        <dt className="col-sm-4">Total Days:</dt>
        <dd className="col-sm-8">{totalDays}</dd>

        <dt className="col-sm-4">Rent per day:</dt>
        <dd className="col-sm-8">{rentPerDay}</dd>

        <dt className="col-sm-4">Total Amount:</dt>
        <dd className="col-sm-8">{totalAmount}</dd>
      </dl>
    </div>
  );
}

function Bookingscreen({ match }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [room, setRoom] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  const roomid = match.params.roomid;
  const fromdate = moment(match.params.fromdate, "DD-MM-YYYY");
  const todate = moment(match.params.todate, "DD-MM-YYYY");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      window.location.href = "/login";
    }
    async function fetchRoomDetails() {
      try {
        setError("");
        setLoading(true);
        const data = (
          await axios.post("/api/rooms/getroombyid", {
            roomid: match.params.roomid,
          })
        ).data;
        setRoom(data);
      } catch (error) {
        console.error("Error fetching room details:", error);
        setError("Error fetching room details");
      }
      setLoading(false);
    }

    fetchRoomDetails();
  }, [match.params.roomid]);

  useEffect(() => {
    const totaldays = moment.duration(todate.diff(fromdate)).asDays() + 1;
    setTotalDays(totaldays);
    setTotalAmount(totaldays * room.rentperday);
  }, [room, fromdate, todate]);

  const onToken = async (token) => {
    console.log(token);
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem("currentUser"))._id,
      fromdate,
      todate,
      totalAmount,
      totaldays: totalDays,
      token,
    };

    try {
      setLoading(true);
      const result = await axios.post("/api/bookings/bookroom", bookingDetails);
      setLoading(false);
      Swal.fire(
        "Congratulations",
        "Your Room Booked Successfully",
        "success"
      ).then((result) => {
        window.location.href = "/home";
      });
    } catch (error) {
      setError("Error booking room");
      Swal.fire("Oops", "Error booking room", "error");
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      {loading ? (
        <Loader />
      ) : error ? (
        <Error msg={error} />
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-9">
            <div className="card booking-card">
              <div className="card-body">
                <h1 className="card-title">{room.name}</h1>
                <div className="row">
                  <div className="col-md-6">
                    <img src={room.imageurls[0]} alt="" className="img-fluid" />
                  </div>
                  <div className="col-md-6">
                    <BookingDetails
                      user={JSON.parse(localStorage.getItem("currentUser"))}
                      fromdate={match.params.fromdate}
                      todate={match.params.todate}
                      maxcount={room.maxcount}
                    />
                    <AmountDetails
                      totalDays={totalDays}
                      rentPerDay={room.rentperday}
                      totalAmount={totalAmount}
                    />
                    <StripeCheckout
                      amount={totalAmount * 100}
                      token={onToken}
                      currency="INR"
                      stripeKey="pk_test_51O9WBOSIyGgiMQrLCwUPCRbY72ulPsdoF2exIkjRfhcnhxEycbPs0Q1O7L0L71OH88CrmWfznRKlPe1XtCcgoVrD002RemqUt4"
                    >
                      <button className="btn btn-primary mt-3">Pay Now</button>
                    </StripeCheckout>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookingscreen;
