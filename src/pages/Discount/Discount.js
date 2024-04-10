import { Table, Button } from "antd";
import "./Discount.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { notification } from "antd";
import { BsPlusCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
const key = "updatable";
function Voucher() {
  const [data, setData] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [falg, setFalg] = useState(false);
  const handleUpdateDiscount = (record) => {
    navigate(`/discount-edit/${record.key}`);
  };
  useEffect(() => {
    getAllDiscount();
  }, [falg]);

  const getAllDiscount = async () => {
    try {
      const response = await axios.get("/api/admin/discounts");
      const formattedData = response.data.map((item, index) => ({
        KM_id: item.KM_id,
        index: index + 1,
        key: item.KM_id,
        SP_ten: item.SP_ten,
        KM_noiDung: item.KM_noiDung,
        KM_ngayBatDau: formatDate(item.KM_ngayBatDau),
        KM_ngayKetThuc: formatDate(item.KM_ngayKetThuc),

        KM_mucGiamGia: item.KM_mucGiamGia.toLocaleString("vi", {
          style: "currency",
          currency: "VND",
        }),
      }));
      setData(formattedData);
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
      title: "TÊN SẢN PHẨM",
      dataIndex: "SP_ten",
      key: "SP_ten",
    },
    {
      title: "NỘI DUNG KHUYẾN MÃI",
      dataIndex: "KM_noiDung",
      key: "KM_noiDung",
    },

    {
      title: "NGÀY BẮT ĐẦU",
      dataIndex: "KM_ngayBatDau",
      key: "KM_ngayBatDau",
    },
    {
      title: "NGÀY KẾT THÚC",
      dataIndex: "KM_ngayKetThuc",
      key: "KM_ngayKetThuc",
    },
    {
      title: "MỨC GIẢM GIÁ",
      dataIndex: "KM_mucGiamGia",
      key: "KM_mucGiamGia",
    },
    {
      title: "",
      dataIndex: "",
      render: (_, record) => (
        <div style={{ textAlign: "right" }}>
          {" "}
          <Button onClick={() => handleUpdateDiscount(record)}>Cập nhật</Button>
          <Button
            className="mx-2"
            type="primary"
            danger
            ghost
            onClick={() => deleteDiscount(record)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const handleAddDiscount = () => {
    navigate("/discount/add");
  };

  const deleteDiscount = async (record) => {
    try {
      const response = await axios.delete(`/api/admin/discount/delete`, {
        params: {
          KM_id: record.key,
        },
      });
      if (response.status === 200) {
        api.open({
          key,
          type: "success",
          message: "Xóa khuyến mãi thành công!",
        });
        setFalg(!falg);
      } else {
        api.open({
          key,
          type: "error",
          message: "Xóa khuyến mãi thất bại!",
        });
      }
    } catch (error) {
      console.error("Error occurred while deleting discount:", error);
    }
  };
  function formatDate(dateObject) {
    const date = new Date(dateObject);
    const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits, pad with 0 if necessary
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed, so add 1
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  return (
    <div className="container-voucher ">
      {contextHolder}
      <div className="title-primary pb-4">Quản lý khuyến mãi</div>
      <div className="text-end mb-4">
        <Button onClick={handleAddDiscount} size="large" className="btn-add">
          Tạo khuyến mãi <BsPlusCircle className="fs-5 ms-2 mb-1" />
        </Button>
      </div>
      <Table columns={columns} dataSource={data} onChange={onChange} />
    </div>
  );
}
export default Voucher;
