import React, { useState } from "react";
import axios from "axios";
import { Form, Input, InputNumber, Button, Select } from "antd";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import Error from "../components/Error";

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const AdminAddRoomScreen = () => {
  const { Option } = Select;

  const [room, setRoom] = useState({
    name: "",
    description: "",
    maxcount: 1,
    phonenumber: "",
    rentperday: 1,
    imageurl1: "",
    imageurl2: "",
    imageurl3: "",
    type: "",
    address: "", // Add the address field
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setError("");
    setLoading(true);

    try {
      const data = (await axios.post("/api/rooms/addroom", values)).data;
      Swal.fire("Congratulations", "Your Room Added Successfully", "success");
      form.resetFields();
      setRoom({
        name: "",
        description: "",
        maxcount: 1,
        phonenumber: "",
        rentperday: 1,
        imageurl1: "",
        imageurl2: "",
        imageurl3: "",
        type: "",
        address: "", // Reset address in the state
      });
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "An error occurred");
      Swal.fire("Oops", `Error: ${error.response?.data?.message || "An error occurred"}`, "error");
    }

    setLoading(false);
  };

  const onReset = () => {
    form.resetFields();
    setRoom({
      name: "",
      description: "",
      maxcount: 1,
      phonenumber: "",
      rentperday: 1,
      imageurl1: "",
      imageurl2: "",
      imageurl3: "",
      type: "",
      address: "", // Reset address in the state
    });
  };

  return (
    <div className="row">
      {loading ? (
        <Loader />
      ) : error.length > 0 ? (
        <Error msg={error} />
      ) : (
        <div className="col-md-12">
          <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please enter the name",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: "Please enter the description",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="maxcount"
              label="Max Count"
              rules={[
                {
                  required: true,
                  message: "Please enter the max count",
                },
              ]}
            >
              <InputNumber min={1} defaultChecked={1} />
            </Form.Item>
            <Form.Item
              name="phonenumber"
              label="Phone Number"
              rules={[
                {
                  required: true,
                  message: "Please enter the phone number",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="rentperday"
              label="Rent Per Day"
              rules={[
                {
                  required: true,
                  message: "Please enter the rent per day",
                },
              ]}
            >
              <InputNumber min={1} defaultChecked={1} />
            </Form.Item>
            <Form.Item
              name="imageurl1"
              label="Image URL 1"
              rules={[
                {
                  required: true,
                  message: "Please enter the image URL 1",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="imageurl2"
              label="Image URL 2"
              rules={[
                {
                  // Optional rule
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="imageurl3"
              label="Image URL 3"
              rules={[
                {
                  // Optional rule
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="type"
              label="Type"
              rules={[
                {
                  required: true,
                  message: "Please select the room type",
                },
              ]}
            >
              <Select placeholder="Select a room type" allowClear>
                <Option value="delux">Delux</Option>
                <Option value="non-delux">Non-Delux</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
              rules={[
                {
                  required: true,
                  message: "Please enter the address",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
              <Button type="danger" htmlType="button" onClick={onReset}>
                Reset
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};

export default AdminAddRoomScreen;
