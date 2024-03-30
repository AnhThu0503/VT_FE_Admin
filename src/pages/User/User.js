import axios from "axios";
import { useEffect, useState } from "react";
import { Table, Button, notification } from "antd";
import "./User.scss";
const key = "updatable";
const User = () => {
  const [users, setUsers] = useState();
  const [falg, setFalg] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    getAllUser();
  }, [falg]);
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
          <Button
            className="mx-2"
            type="primary"
            danger
            ghost
            onClick={() => deleteUser(record)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];
  const deleteUser = async (record) => {
    try {
      console.log(record);
      // Make a DELETE request to your backend API endpoint
      const response = await axios.delete(`/api/admin/user/delete`, {
        params: {
          ND_id: record.key,
        },
      });

      // Check if the request was successful
      if (response.status === 200) {
        console.log("User deleted successfully");

        setFalg(!falg);
        api.open({
          key,
          type: "success",
          message: "Xóa người dùng thành công!",
        });
      } else {
        console.log("Failed to delete user");
        // Optionally, you can return false to indicate failure
        api.open({
          key,
          type: "error",
          message: "Xóa người dùng thất bại!",
        });
      }
    } catch (error) {
      console.error("Error occurred while deleting user:", error);
    }
  };
  return (
    <div className="container-category">
      {contextHolder}
      <div className="text-center title-primary pb-4">Quản lý người dùng</div>
      <Table columns={columns} dataSource={users} style={{}} />
    </div>
  );
};
export default User;
