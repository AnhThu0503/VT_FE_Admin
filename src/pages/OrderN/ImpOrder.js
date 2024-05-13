import { Table, Button, Modal } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import "./ImpOrder.scss";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BsPlusCircle } from "react-icons/bs";

function ImpOrder() {
  const componentPDF = useRef();
  const [ordersN, setOrdersN] = useState([]);
  const [orderN, setOrderN] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOrderOpen, setIsModalOrderOpen] = useState(false);
  const [tongTien, setTongTien] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    getAllOrderN();
  }, []);

  const sumPrice = (products) => {
    let sum = 0;
    products.map((product) => {
      sum += product.soluong * product.giaNhap;
    });
    return sum;
  };
  const getAllOrderN = async () => {
    try {
      const response = await axios.get("/api/admin/ordersN");

      let arrtmp = [];
      response.data.forEach((data, index) => {
        arrtmp = [
          ...arrtmp, // Spread the current items in arrtmp
          {
            HDN_id: data.orderN.HDN_id,
            key: data.orderN.HDN_id,
            index: index + 1,
            HDN_noiDung: data.orderN.HDN_noiDung,
            HDN_CT: data.detailOrderProductN,
            HDN_tongTien: sumPrice(data.detailOrderProductN).toLocaleString(
              "vi",
              {
                style: "currency",
                currency: "VND",
              }
            ),
            HDN_ngayNhap: formatDate(data.orderN.HDN_ngayNhap),
          },
        ];
      });
      setOrdersN(arrtmp);
    } catch (error) {
      console.error("Error fetching ordersN:", error);
    }
  };
  const handleOpenPDF = useReactToPrint({
    content: () => componentPDF.current,
  });
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
    },

    {
      title: "Nội dung",
      dataIndex: "HDN_noiDung",
      key: "HDN_noiDung",
    },

    {
      title: "Tổng tiền",
      dataIndex: "HDN_tongTien",
      key: "HDN_tongTien",
    },
    {
      title: "Ngày nhập",
      dataIndex: "HDN_ngayNhap",
      key: "HDN_ngayNhap",
    },

    {
      title: "Chi tiết hóa đơn nhập",
      dataIndex: "HDN_CT",
      key: "HDN_CT",
      render: (_, record) => (
        <div>
          <Button
            onClick={() => {
              console.log(record);
              setIsModalOrderOpen(true);
              setOrderN(record);
            }}
          >
            Xem chi tiết
          </Button>
        </div>
      ),
    },
  ];
  function formatDate(dateObject) {
    const date = new Date(dateObject);
    const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits, pad with 0 if necessary
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed, so add 1
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  const showModal = (record) => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setIsModalOrderOpen(false);
  };

  const handleCancel = () => {
    setIsModalOrderOpen(false);
    setIsModalOpen(false);
  };
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  const handleAddOrderN = () => {
    navigate("/order-nhap/add");
  };
  return (
    <div className="container-order">
      <div className="text-center title-primary pb-4">
        Quản lý đơn nhập hàng
      </div>
      <div className="text-end mb-4">
        <Button onClick={handleAddOrderN} size="large" className="btn-add">
          Tạo đơn nhập hàng <BsPlusCircle className="fs-5 ms-2 mb-1" />
        </Button>
      </div>
      <Table columns={columns} dataSource={ordersN} onChange={onChange} />
      <Modal
        title="Chi tiết đơn nhập hàng"
        open={isModalOrderOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={() => <Button onClick={handleOpenPDF}>In hóa đơn nhập</Button>}
      >
        <div ref={componentPDF}>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Tên sản phẩm</th>
                <th scope="col">Trọng lượng</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Giá nhập</th>
              </tr>
            </thead>
            <tbody>
              {orderN.HDN_CT &&
                orderN.HDN_CT.map((item, index) => (
                  <tr key={index}>
                    <td>{item[0].SP_ten}</td>
                    <td>
                      {item[0].SP_trongLuong} {item[0].SP_donViTinh}
                    </td>
                    <td>{item.soluong}</td>
                    <td>
                      {item.giaNhap.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                      /sp
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr className="text-end">
                <td colSpan="4">
                  Tổng tiền:{" "}
                  {orderN.HDN_CT && orderN.HDN_CT.length > 0
                    ? orderN.HDN_CT.reduce(
                        (acc, item) => acc + item.soluong * item.giaNhap,
                        0
                      ).toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })
                    : "0 VND"}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Modal>
    </div>
  );
}
export default ImpOrder;
