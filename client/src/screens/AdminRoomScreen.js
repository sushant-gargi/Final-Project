// AdminRoomScreen.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Space } from "antd";

import Loader from "../components/Loader";
import Error from "../components/Error";

function AdminRoomScreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const columns = [
    {
      title: "Roomid",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    { title: "Max count", dataIndex: "maxcount", key: "maxcount" },
    { title: "Phone number", dataIndex: "phonenumber", key: "phonenumber" },
    { title: "Rent /day", dataIndex: "rentperday", key: "rentperday" },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <button onClick={() => handleDelete(record._id)}>Delete</button>
        </Space>
      ),
    },
  ];

  async function fetchMyData() {
    setError("");
    setLoading(true);
    try {
      const data = (await axios.post("/api/rooms/getallrooms")).data;
      setRooms(data);
    } catch (error) {
      console.log(error);
      setError(error);
    }
    setLoading(false);
  }

  async function handleDelete(roomId) {
    setError("");
    setLoading(true);
    try {
      await axios.post("/api/rooms/deleteroom", { roomId });
      // After successful deletion, refresh the data
      fetchMyData();
    } catch (error) {
      console.error(error);
      setError(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMyData();
  }, []);

  return (
    <div className="row">
      {loading ? (
        <Loader></Loader>
      ) : error.length > 0 ? (
        <Error msg={error}></Error>
      ) : (
        <>
          <div className="col md-12">
            <button className="btn btn-success" onClick={fetchMyData}>
              Refresh
            </button>
          </div>
          <div className="col-md-12">
            <Table columns={columns} dataSource={rooms} />
          </div>
        </>
      )}
    </div>
  );
}

export default AdminRoomScreen;
