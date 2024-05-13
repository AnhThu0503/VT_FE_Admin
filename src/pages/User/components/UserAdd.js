import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Button, message, Form, Input, Select } from "antd";
import { notification } from "antd";
const key = "updatable";
const { TextArea } = Input;
function UserAdd() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [idGT, setIDGT] = useState();

  const UserAdd = async (values) => {
    try {
      const response = await axios.post("/api/admin/user/add", {
        ND_ten: values.ND_ten,
        ND_email: values.ND_email,
        ND_SDT: values.ND_SDT,
        ND_matKhau: values.ND_matKhau,
        ND_diaChi: values.ND_diaChi,
        ND_gioiTinh: idGT,
      });
      console.log(response);
      if (response.data) {
        messageApi.open({
          type: "success",
          content: "Tạo người dùng thành công!",
        });
        navigate("/user");
      } else {
        messageApi.open({
          type: "error",
          content: "Tạo người dùng thất bại!",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      messageApi.open({
        type: "error",
        content: "Tạo người dùng thất bại!",
      });
    }
  };
  return (
    <div className="container-update pb-4 mt-4">
      {contextHolder}
      <div className="title-primary text-center">Tạo người dùng</div>
      <div className="mt-4 col-sm-8 mx-auto">
        <Form
          form={form}
          name="basic"
          layout="vertical"
          style={{ width: "100%" }}
          initialValues={{
            remember: true,
          }}
          onFinish={UserAdd}
        >
          <Form.Item
            label="Tên người dùng"
            name="ND_ten"
            rules={[
              {
                required: true,
                message: "Vui lòng không để trống tên!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="ND_email"
            rules={[
              {
                required: true,
                message: "Vui lòng không để trống email!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="ND_SDT"
            rules={[
              {
                required: true,
                message: "Vui lòng không để trống số điện thoại!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="ND_matKhau"
            rules={[
              {
                required: true,
                message: "Vui lòng không để trống mật khẩu!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="ND_diaChi"
            rules={[
              {
                required: true,
                message: "Vui lòng không để trống địa chỉ!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Giới tính"
            name="ND_gioiTinh"
            rules={[
              {
                required: true,
                message: "Vui lòng không để trống giới tính!",
              },
            ]}
          >
            <Select
              className="m-0"
              size="large"
              onChange={(value) => setIDGT(value)}
              style={{ width: "fitContent" }}
              value={idGT}
            >
              <Select.Option value={1}>Nam</Select.Option>
              <Select.Option value={2}>Nữ</Select.Option>
              <Select.Option value={3}>Khác</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <div className="text-end">
              <Button
                htmlType="submit"
                className="btn-upload-discount"
                size="large"
              >
                Tạo
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
export default UserAdd;
