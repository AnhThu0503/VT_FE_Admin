import axios from "axios";
import { useEffect, useState } from "react";
import { Table, Button, Input } from "antd";
import { notification } from "antd";

import "./Suppliers.scss";
const key = "updatable";

const Suppliers = () => {
  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [suppliers, setSuppliers] = useState([]);
  const [falg, setFalg] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const uploadSupplier = async () => {
    try {
      const response = await axios.post("/api/admin/supplier", {
        name,
        address,
      });
      if (response.data) {
        api.open({
          key,
          type: "success",
          message: "Tạo nhà cung cấp thành công!",
        });
        setFalg(!falg);
        setAddress("");
        setName("");
      } else {
        api.open({
          key,
          type: "error",
          message: "Tạo nhà cung cấp thất bại!",
        });
      }
    } catch (e) {
      api.open({
        key,
        type: "error",
        message: "Tạo nhà cung cấp thất bại!",
      });
    }
  };
  useEffect(() => {
    getAllSupplier();
  }, [falg]);
  const getAllSupplier = async () => {
    try {
      const response = await axios.get("/api/admin/supplier");
      const formattedData = response.data.map((item, index) => ({
        key: item.NCC_id,
        index: index + 1,
        name: item.NCC_ten,
        address: item.NCC_diaChi,
      }));
      setSuppliers(formattedData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
    },
    {
      title: "TÊN NHÀ CUNG CẤP",
      dataIndex: "name",
    },
    {
      title: "ĐỊA CHỈ",
      dataIndex: "address",
    },
    {
      title: "",
      dataIndex: "",
      render: (text, record) => (
        <div style={{ textAlign: "right" }}>
          <Button
            className="mx-2"
            type="primary"
            onClick={() => deleteSupplier(record)}
            danger
            ghost
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];
  const deleteSupplier = async (record) => {
    try {
      console.log(record);
      // Make a DELETE request to your backend API endpoint
      const response = await axios.delete(`/api/admin/supplier/delete`, {
        params: {
          NCC_id: record.key,
        },
      });

      // Check if the request was successful
      if (response.status === 200) {
        console.log("Supplier deleted successfully");
        api.open({
          key,
          type: "success",
          message: "Xóa nhà cung cấp thành công!",
        });
        setFalg(!falg);
      } else {
        console.log("Failed to delete supplier");
        api.open({
          key,
          type: "error",
          message: "Xóa nhà cung cấp thất bại!",
        });
        // Optionally, you can return false to indicate failure
      }
    } catch (error) {
      api.open({
        key,
        type: "error",
        message: "Xóa nhà cung cấp thất bại!",
      });
      console.error("Error occurred while deleting supplier:", error);
    }
  };
  const onChangeTable = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  return (
    <div className="container-supplier">
      {contextHolder}

      <div className="text-center title-primary pb-4">Quản lý nhà cung cấp</div>
      <div
        className="col-sm-12 d-flex mb-4"
        style={{ justifyContent: "space-between" }}
      >
        <div className="col-sm-5">
          <Input
            size="large"
            placeholder="Nhập tên nhà cung cấp"
            style={{ borderRadius: "0" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="col-sm-5">
          <Input
            size="large"
            placeholder="Nhập địa chỉ nhà cung cấp"
            style={{ borderRadius: "0" }}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <Button
          onClick={uploadSupplier}
          className="btn-upload-category"
          size="large"
          style={{ borderRadius: "0" }}
        >
          Thêm
        </Button>
      </div>
      <Table
        className="col-sm-12"
        columns={columns}
        dataSource={suppliers}
        onChange={onChangeTable}
      />
    </div>
  );
};
export default Suppliers;
