import { useEffect, useState } from "react";
import axios from "axios";
import { Input, Form, Button, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
const key = "updatable";
async function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsDataURL(file);
  });
}
const UserUpdate = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [user, setUser] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const navigation = useNavigate();
  useEffect(() => {
    (async () => {
      const response = await axios.post("/api/admin/user/update", {
        ND_id: id,
      });
      console.log(response.data);
      if (response.data) {
        form.setFieldsValue({
          ND_ten: response.data.user[0].ND_ten,
          ND_email: response.data.user[0].ND_email,
          ND_diaChi: response.data.user[0].ND_diaChi,
          ND_SDT: response.data.user[0].ND_SDT,
        });
      }
    })();
  }, []);
  const updateUser = async (values) => {
    try {
      const response = await axios.put("/api/admin/user/update", {
        ND_id: id,
        ND_ten: values.ND_ten,
        ND_email: values.ND_email,
        ND_SDT: values.ND_SDT,
        ND_diaChi: values.ND_diaChi,
      });
      console.log(response);
      if (response.data) {
        messageApi.open({
          type: "success",
          content: "Cập nhật người dùng thành công!",
        });
        navigation("/user");
      } else {
        messageApi.open({
          type: "error",
          content: "Cập nhật người dùng thất bại!",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="container-upload pb-4 mt-4">
      {contextHolder}
      <div className="title-primary text-center">Cập nhật người dùng</div>
      <div className="mt-4">
        <Form
          className="col-sm-11 mx-auto"
          form={form}
          name="basic"
          layout="vertical"
          style={{}}
          initialValues={{
            remember: true,
          }}
          onFinish={updateUser}
        >
          <div className="d-flex" style={{ justifyContent: "space-between" }}>
            <Form.Item
              label="Tên người dùng"
              name="ND_ten"
              className="col-sm-5"
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
              className="col-sm-5"
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
          </div>
          <div className="d-flex" style={{ justifyContent: "space-between" }}>
            <Form.Item
              label="Số điện thoại"
              name="ND_SDT"
              className="col-sm-5"
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
              label="Địa chỉ"
              name="ND_diaChi"
              className="col-sm-5"
              rules={[
                {
                  required: true,
                  message: "Vui lòng không để trống số điện thoại!",
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </div>

          <Form.Item>
            <div className="text-end">
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                className="btn-upload-product"
              >
                Lưu
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default UserUpdate;
