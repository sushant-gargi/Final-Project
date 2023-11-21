import React, { useState, useEffect } from "react";
import axios from "axios";
import "antd/dist/antd.css";
import { DatePicker } from "antd";
import moment from "moment";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Homescreen.css";

AOS.init({ duration: 1000 });

const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";

const Homescreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rooms, setRooms] = useState([]);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState([]);
  const [duplicateRooms, setDuplicateRooms] = useState([]);
  const [searchAddress, setSearchAddress] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setError("");
        setLoading(true);

        if (!searchAddress.trim()) {
          const response = await axios.get(`/api/rooms/getallrooms`);
          const data = response.data;

          if (data.length === 0) {
            setError("No hotels available");
          } else {
            setRooms(data);
            setDuplicateRooms(data);
          }
        } else {
          const response = await axios.get(
            `/api/rooms/getallrooms?location=${selectedLocation}`
          );

          const data = response.data;
          if (data.length === 0) {
            setError("No hotels available at this location");
          } else {
            const filteredRooms = data.filter((room) =>
              room.address.toLowerCase().includes(searchAddress.toLowerCase())
            );

            if (filteredRooms.length === 0) {
              setError("No hotels found for the specified address");
            } else {
              setRooms(filteredRooms);
              setDuplicateRooms(filteredRooms);
            }
          }
        }
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchRooms();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [selectedLocation, searchAddress]);

  const filterByDate = (dates) => {
    try {
      setFromDate(moment(dates[0]).format(dateFormat));
      setToDate(moment(dates[1]).format(dateFormat));

      const tempRooms = duplicateRooms.filter((room) => {
        return room.currentbookings.every((booking) => {
          const bookingStartDate = moment(booking.fromdate, dateFormat);
          const bookingEndDate = moment(booking.todate, dateFormat);

          return (
            !moment(fromDate).isBetween(bookingStartDate, bookingEndDate, null, '[]') &&
            !moment(toDate).isBetween(bookingStartDate, bookingEndDate, null, '[]')
          );
        });
      });

      setRooms(tempRooms);
    } catch (error) {
      console.error(error);
    }
  };

  const filterByType = (selectedType) => {
    const tempRooms =
      selectedType !== "all"
        ? duplicateRooms.filter((x) => x.type.toLowerCase() === selectedType.toLowerCase())
        : duplicateRooms;

    setRooms(tempRooms);
  };

  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-3">
          <RangePicker format={dateFormat} onChange={filterByDate} />
        </div>

        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search address"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
        </div>

        <div className="col-md-3 select-box">
          <select
            className="form-control"
            onChange={(e) => filterByType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="delux">Delux</option>
            <option value="non-delux">Non-Delux</option>
          </select>
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : error.length > 0 ? (
          <Error msg={error} />
        ) : (
          rooms.map((x) => (
            <div className="col-md-9 mt-3" key={x.id}>
              <Room room={x} fromDate={fromDate} toDate={toDate} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Homescreen;
