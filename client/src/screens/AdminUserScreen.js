// AdminUserScreen.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Tag, Button, Popconfirm, Space, Modal, Form, Input } from "antd";

import Loader from "../components/Loader";
import Error from "../components/Error";

const { Item } = Form;

function AdminUserScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [form] = Form.useForm();

  const columns = [
    { title: "User-id", dataIndex: "_id", key: "_id" },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: (isAdmin, record) => (
        <>
          {isAdmin === true ? (
            <Tag color="green">YES</Tag>
          ) : (
            <Tag color="red">NO</Tag>
          )}
          {!isAdmin && (
            <Popconfirm
              title="Are you sure you want to make this user an admin?"
              onConfirm={() => makeAdmin(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" size="small" style={{ marginLeft: 8 }}>
                Make Admin
              </Button>
            </Popconfirm>
          )}
        </>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" onClick={() => showUpdateModal(record._id)}>
            Update
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => deleteUser(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  async function fetchMyData() {
    setError("");
    setLoading(true);
    try {
      const data = (await axios.get("/api/users/getallusers")).data;
      setUsers(data);
    } catch (error) {
      console.error(error);
      setError(error.message || "An error occurred while fetching user data");
    } finally {
      setLoading(false);
    }
  }

  async function makeAdmin(userId) {
    setError("");
    setLoading(true);
    try {
      await axios.post("/api/users/makeadmin", { userId });
      fetchMyData();
    } catch (error) {
      console.error(error);
      setError(error.message || "Error making the user an admin");
      setLoading(false);
    }
  }

  async function deleteUser(userId) {
    setError("");
    setLoading(true);
    try {
      await axios.post("/api/users/deleteuser", { userId });
      fetchMyData();
    } catch (error) {
      console.error(error);
      setError(error.message || "Error deleting the user");
      setLoading(false);
    }
  }

  const showUpdateModal = (userId) => {
    setUpdateModalVisible(true);
    setSelectedUserId(userId);
    const selectedUser = users.find((user) => user._id === userId);
    form.setFieldsValue({
      name: selectedUser.name,
      email: selectedUser.email,
    });
  };

  const handleUpdateModalOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.post("/api/users/updateuser", { userId: selectedUserId, ...values });
      setUpdateModalVisible(false);
      fetchMyData();
    } catch (error) {
      console.error(error);
      setError(error.message || "Error updating the user");
    }
  };

  const handleUpdateModalCancel = () => {
    setUpdateModalVisible(false);
  };

  useEffect(() => {
    fetchMyData();
  }, []);

  return (
    <div className="row">
      {loading ? (
        <Loader />
      ) : error ? (
        <Error msg={error} />
      ) : (
        <div className="col-md-12">
          <Table columns={columns} dataSource={users} />
          <Modal
            title="Update User Profile"
            visible={isUpdateModalVisible}
            onOk={handleUpdateModalOk}
            onCancel={handleUpdateModalCancel}
          >
            <Form form={form} layout="vertical">
              <Item name="name" label="Name" rules={[{ required: true, message: "Please enter the name" }]}>
                <Input />
              </Item>
              <Item name="email" label="Email" rules={[{ required: true, message: "Please enter the email" }]}>
                <Input />
              </Item>
            </Form>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default AdminUserScreen;
