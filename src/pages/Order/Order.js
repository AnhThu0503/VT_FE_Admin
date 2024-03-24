import { Table, Button, Select, Modal } from "antd";
import "./Order.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { notification } from "antd";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
const key = "updatable";

function Order() {
  const componentPDF = useRef();
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({});
  const [order, setOrder] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOrderOpen, setIsModalOrderOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    getAllOrder();
  }, []);

  const getAllOrder = async () => {
    try {
      const response = await axios.get("/api/admin/orders");

      let arrtmp = [];
      response.data.forEach((data) => {
        arrtmp.push({
          DH_id: data.order.DH_id,
          index: data.order.DH_id,
          DH_trangThai: data.order.DH_trangThai,
          ND_diaChi: data.user[0].ND_diaChi,
          chiTietKH: data.user[0],
          DH_ngayDat: formatDate(data.order.DH_ngayDat),
          DonHangCT: data.detailOrderProduct,
        });
      });
      setOrders(arrtmp);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  function formatDate(dateObject) {
    const date = new Date(dateObject);
    const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits, pad with 0 if necessary
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed, so add 1
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const handleChange = async (value, record) => {
    try {
      const response = await axios.put("/api/admin/order/update", {
        DH_id: record.DH_id,
        trangthai: value,
      });

      if (response.data) {
        console.log(response);
        api.open({
          key, // Unique key for each notification
          message: "Cập nhật trạng thái thành công",
        });
      } else {
        api.open({
          key, // Unique key for each notification
          message: "Cập nhật trạng thái thất bại",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenPDF = useReactToPrint({
    content: () => componentPDF.current,
  });

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
    },

    {
      title: "Địa chỉ",
      dataIndex: "ND_diaChi",
    },
    {
      title: "Xem chi tiết KH",
      dataIndex: "chiTietKH",
      render: (_, record) => {
        return (
          <div>
            <Button
              onClick={() => {
                showModal(record);
              }}
            >
              Xem thêm
            </Button>
          </div>
        );
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "DH_ngayDat",
    },
    {
      title: "Trạng thái",
      dataIndex: "DH_trangThai",
      render: (text, record) => (
        <Select
          defaultValue={record.DH_trangThai}
          style={{
            width: 150,
          }}
          onChange={(e) => {
            handleChange(e, record);
          }}
          options={[
            {
              value: "Chờ xác nhận",
              label: "Chờ xác nhận",
            },
            {
              value: "Đang chuẩn bị",
              label: "Đang chẩn bị",
            },
            {
              value: "Đang vận chuyển",
              label: "Đang vận chuyển",
            },
            {
              value: "Đã giao hàng",
              label: "Đã giao hàng",
            },
          ]}
        />
      ),
      filters: [
        {
          text: "Chờ xác nhận",
          value: "Chờ xác nhận",
        },
        {
          text: "Đang chuẩn bị",
          value: "Đang chuẩn bị",
        },
        {
          text: "Đang vận chuyển",
          value: "Đang vận chuyển",
        },
        {
          text: "Đã giao",
          value: "Đã giao hàng",
        },
      ],
      filterSearch: true,
      onFilter: (value, record) => record.state === value,
    },
    {
      title: "Xem chi tiết ĐH",
      dataIndex: "DonHangCT",
      render: (text, record) => (
        <div>
          <Button
            onClick={() => {
              console.log(record);
              setIsModalOrderOpen(true);
              setOrder(record);
            }}
          >
            Xem thêm
          </Button>
        </div>
      ),
    },
  ];

  const showModal = (record) => {
    setIsModalOpen(true);
    setUser({
      ten: record.chiTietKH.ND_ten,
      email: record.chiTietKH.ND_email,
      sdt: record.chiTietKH.ND_SDT,
    });
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setIsModalOrderOpen(false);
  };

  const handleCancel = () => {
    setIsModalOrderOpen(false);
    setIsModalOpen(false);
  };

  return (
    <div className="container-order">
      {contextHolder}
      <div className="text-center title-primary pb-4">Quản lý đơn hàng</div>
      <Table columns={columns} dataSource={orders} />

      <Modal
        title="Thông tin khách hàng"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {user && (
          <>
            <div>Tên khách hàng: {user.ten}</div>
            <div>Email: {user.email}</div>
            <div>SĐT: {user.sdt}</div>
          </>
        )}
      </Modal>

      <Modal
        title="Chi tiết đơn hàng"
        open={isModalOrderOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={() => <Button onClick={handleOpenPDF}>In hóa đơn</Button>}
      >
        <div ref={componentPDF}>
          {order.chiTietKH && (
            <>
              <div>Tên khách hàng: {order.chiTietKH.ND_ten}</div>
              <div style={{ marginTop: "3px" }}>{order.chiTietKH.ND_email}</div>
            </>
          )}
          {order.DonHangCT &&
            order.DonHangCT.length >= 0 &&
            order.DonHangCT.map((item, index) => {
              console.log(item[0].SP_ten);
              return (
                <div key={index} className="mb-3">
                  <div>Tên sản phẩm: {item[0].SP_ten}</div>
                  <div>
                    Chi tiết sản pẩm: {item[0].SP_trongLuong}
                    {item[0].SP_donViTinh}
                  </div>
                  <div>Số lượng: {item.soluong}</div>
                </div>
              );
            })}
        </div>
      </Modal>
    </div>
  );
}
export default Order;
