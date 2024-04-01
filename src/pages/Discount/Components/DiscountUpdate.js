import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, message, Form, Input } from "antd";
import "./DiscountAdd.scss";
import dayjs from "dayjs";

const { TextArea } = Input;
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
const DiscountUpdate = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [discount, setDiscount] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await axios.post("/api/admin/discount/update", {
        KM_id: id,
      });
      console.log(response.data);
      if (response.data) {
        form.setFieldsValue({
          KM_noiDung: response.data.discount[0].KM_noiDung,
          SP_id: response.data.discount[0].SP_id,
          KM_ngayBatDau: dayjs(response.data.discount[0].KM_ngayBatDau).format(
            "DD-MM-YYYY"
          ),
          KM_ngayKetThuc: dayjs(
            response.data.discount[0].KM_ngayKetThuc
          ).format("DD-MM-YYYY"),
          KM_mucGiamGia: response.data.discount[0].KM_mucGiamGia,
        });
      }
    })();
  }, []);
  const validateDate = (date) => {
    const dateString = date; // Your date string

    // Parse the date string and create a Date object
    const dateParts = dateString.split("-");
    const year = parseInt(dateParts[2]);
    const month = parseInt(dateParts[1]) - 1; // Months in JavaScript are zero-based
    const day = parseInt(dateParts[0]);
    const dateObject = new Date(year, month, day);

    // Convert the Date object to the ISO 8601 format
    const isoDateString = dateObject.toISOString();

    return isoDateString;
  };
  const updateDiscount = async (values) => {
    try {
      const response = await axios.put("/api/admin/discount/update", {
        KM_id: id,
        KM_noiDung: values.KM_noiDung,
        SP_id: values.SP_id,
        KM_ngayBatDau: validateDate(values.KM_ngayBatDau),
        KM_ngayKetThuc: validateDate(values.KM_ngayKetThuc),
        KM_mucGiamGia: values.KM_mucGiamGia,
      });
      console.log(response);
      if (response.data) {
        messageApi.open({
          type: "success",
          content: "Cập nhật khuyến mãi thành công!",
        });
        navigate("/discount");
      } else {
        messageApi.open({
          type: "error",
          content: "Cập nhật khuyến mãi thất bại!",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      messageApi.open({
        type: "error",
        content: "Cập nhật khuyến mãi thất bại!",
      });
    }
  };

  return (
    <div className="container-update pb-4 mt-4">
      {contextHolder}
      <div className="title-primary text-center">
        Cập nhật thông tin giảm giá
      </div>
      <div className="mt-4 col-sm-8 mx-auto">
        <Form
          form={form}
          name="basic"
          layout="vertical"
          style={{ width: "100%" }}
          initialValues={{
            remember: true,
          }}
          onFinish={updateDiscount}
        >
          <Form.Item
            label="Nội dung khuyến mãi"
            name="KM_noiDung"
            rules={[
              {
                required: true,
                message: "Vui lòng không để trống nội dung!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Mã sản phẩm"
            name="SP_id"
            rules={[
              {
                required: true,
                message: "Vui lòng không để trống sản phẩm!",
              },
            ]}
          >
            <Input size="large" disabled />
          </Form.Item>

          <Form.Item
            label="Ngày bắt đầu"
            name="KM_ngayBatDau"
            rules={[
              {
                required: true,
                message: "Vui lòng không để trống ngày bắt đầu!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Ngày kết thúc"
            name="KM_ngayKetThuc"
            rules={[
              {
                required: true,
                message: "Vui lòng không để trống ngày kết thúc!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label="Mức giảm giá"
            name="KM_mucGiamGia"
            rules={[
              {
                required: true,
                message: "Vui lòng không để trống mức giảm giá!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item>
            <div className="text-end">
              <Button
                htmlType="submit"
                className="btn-upload-discount"
                size="large"
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
export default DiscountUpdate;
