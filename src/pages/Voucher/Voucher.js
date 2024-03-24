import { Table, Button } from "antd";
import "./Voucher.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { notification } from "antd";
const key = "updatable";
function Voucher() {
  const [data, setData] = useState([]);
  useEffect(() => {
    getAllDiscount();
  }, []);
  function formatDate(dateObject) {
    const date = new Date(dateObject);
    const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits, pad with 0 if necessary
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed, so add 1
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const getAllDiscount = async () => {
    try {
      const response = await axios.get("/api/admin/discounts");
      const formattedData = response.data.map((item, index) => ({
        index: index + 1,
        SP_ten: item.SP_ten,
        key: item.KM_id,
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
      title: "Tên sản phẩm",
      dataIndex: "SP_ten",
    },

    {
      title: "Ngày bắt đầu",
      dataIndex: "KM_ngayBatDau",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "KM_ngayKetThuc",
    },
    {
      title: "Mức giảm giá",
      dataIndex: "KM_mucGiamGia",
      sorter: (a, b) => a.discountPrice - b.discountPrice,
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
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  return (
    <div className="container-voucher ">
      <div className="title-primary pb-4">Quản lý khuyến mãi</div>
      <Table columns={columns} dataSource={data} onChange={onChange} />
    </div>
  );
}
export default Voucher;
