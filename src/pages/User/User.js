import axios from "axios";
import { useEffect, useState } from "react";
import { Table, Button, Input } from "antd";
import "./User.scss";
function User() {
  const [users, setUsers] = useState();
  useEffect(() => {
    getAllUser();
  }, []);
  const getAllUser = async () => {
    try {
      const response = await axios.get("/api/admin/users");
      const formattedData = response.data.map((item, index) => ({
        index: index + 1,
        key: item.ND_id,
        name: item.ND_ten,
        email: item.ND_email,
        gender: item.ND_gioiTinh,
        phone: item.ND_SDT,
        address: item.ND_diaChi,
      }));
      setUsers(formattedData);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
    },
    {
      title: "TÊN NGƯỜI DÙNG",
      dataIndex: "name",
    },
    {
      title: "EMAIL",
      dataIndex: "email",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "",
      dataIndex: "",
      render: (text, record) => (
        <div style={{ textAlign: "right" }}>
          {" "}
          <Button>Cập nhật</Button>
          <Button className="mx-2" type="primary" danger ghost>
            Xóa
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="container-category">
      <div className="text-center title-primary pb-4">Quản lý người dùng</div>
      <Table columns={columns} dataSource={users} style={{}} />
    </div>
  );
}
export default User;
