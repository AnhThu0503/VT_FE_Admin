import { Table, Button, Select, Modal, Input, Space } from "antd";
import "./Order.scss";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { notification } from "antd";
import { useReactToPrint } from "react-to-print";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
const key = "updatable";

function Order() {
  const componentPDF = useRef();
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({});
  const [order, setOrder] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOrderOpen, setIsModalOrderOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  useEffect(() => {
    getAllOrder();
  }, []);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getAllOrder = async () => {
    try {
      const response = await axios.get("/api/admin/orders");
      let arrtmp = [];
      response.data.forEach((data, index) => {
        arrtmp = [
          ...arrtmp, // Spread the current items in arrtmp
          {
            DH_id: data.order.DH_id,
            key: data.order.DH_id,
            index: index + 1,
            DH_trangThai: data.order.DH_trangThai,
            chiTietKH: data.user[0],
            tenKH: data.user[0].ND_ten,
            DH_ngayDat: formatDate(data.order.DH_ngayDat),
            DH_phuongThucTT: data.order.DH_phuongThucTT,
            DonHangCT: data.detailOrderProduct,
            DH_tongTien: data.order.DH_tongTien.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            }),
          },
        ];
      });
      setOrders(arrtmp);
      console.log("setorders", orders);
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
          type: "success",
          message: "Cập nhật trạng thái thành công",
        });
      } else {
        api.open({
          key, // Unique key for each notification
          type: "error",
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
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Tìm khách hàng`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "THÔNG TIN KHÁCH HÀNG",
      dataIndex: "tenKH",
      key: "tenKH",
      ...getColumnSearchProps("tenKH"),
    },

    {
      title: "",
      dataIndex: "chiTietKH",
      key: "chiTietKH",
      render: (_, record) => {
        return (
          <div style={{ marginLeft: "3rem" }}>
            <Button
              onClick={() => {
                showModal(record);
              }}
            >
              Chi tiết
            </Button>
          </div>
        );
      },
    },
    {
      title: "NGÀY ĐẶT",
      dataIndex: "DH_ngayDat",
      key: "DH_ngayDat",
    },
    {
      title: "TỔNG TIỀN",
      dataIndex: "DH_tongTien",
      key: "DH_tongTien",
    },
    {
      title: "TRẠNG THÁI",
      dataIndex: "DH_trangThai",
      key: "DH_trangThai",

      render: (_, record) => {
        console.log(record);
        return (
          <Select
            defaultValue={record.DH_trangThai}
            style={{
              minWidth: 140,
            }}
            onChange={(value) => {
              handleChange(value, record);
            }}
            // disabled={handleDisableSelect(record.status)}
            options={[
              { value: "Chờ xác nhận", label: "Chờ xác nhận" },
              { value: "Đang xử lý", label: "Đang xử lý" },
              { value: "Đang vận chuyển", label: "Đang vận chuyển" },
              { value: "Hủy đơn hàng", label: "Hủy đơn hàng" },
            ]}
          />
        );
      },
      filters: [
        { text: "Đang xử lý", value: "Đang xử lý" },
        { text: "Chờ xác nhận", value: "Chờ xác nhận" },
        { text: "Đang vận chuyển", value: "Đang vận chuyển" },
        { text: "Hủy đơn hàng", value: "Hủy đơn hàng" },
        { text: "Đã nhận hàng", value: "Đã nhận hàng" },
      ],
      onFilter: (value, record) => {
        console.log("FILTER value", value);
        // console.log("FILTER", record.DH_trangThai.indexOf(value));
        return record.DH_trangThai.indexOf(value) === 0;
      },
    },
    {
      title: "PHƯƠNG THỨC THANH TOÁN",
      dataIndex: "DH_phuongThucTT",
      key: "DH_phuongThucTT",
    },
    {
      title: "CHI TIẾT ĐƠN HÀNG",
      dataIndex: "DonHangCT",
      key: "DonHangCT",
      render: (_, record) => (
        <div className="ms-3">
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
      diachi: record.chiTietKH.ND_diaChi,
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
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  return (
    <div className="container-order">
      {contextHolder}
      <div className="text-center title-primary pb-4">Quản lý đơn hàng</div>
      <Table columns={columns} dataSource={orders} onChange={onChange} />

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
            <div>Địa chỉ: {user.diachi}</div>
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
              <div>
                <strong>Tên khách hàng:</strong> {order.chiTietKH.ND_ten}
              </div>
              <div style={{ marginTop: "3px" }}>
                <strong>SĐT: </strong>
                {order.chiTietKH.ND_SDT}
              </div>
              <div>
                <strong>Địa chỉ:</strong> {order.chiTietKH.ND_diaChi}
              </div>
            </>
          )}

          <table className="table">
            <thead>
              <tr>
                <th scope="col">Tên sản phẩm</th>
                <th scope="col">Trọng lượng</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Đơn giá</th>
              </tr>
            </thead>
            <tbody>
              {order.DonHangCT &&
                order.DonHangCT.length >= 0 &&
                order.DonHangCT.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item[0].SP_ten}</td>
                      <td>
                        {item[0].SP_trongLuong} {item[0].SP_donViTinh}
                      </td>
                      <td>{item.soluong}</td>
                      <td>
                        {item.giaBan.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            <tfoot>
              <tr className="text-end">
                <td colSpan="3">Tổng tiền:</td>
                <td>{order.DH_tongTien}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Modal>
    </div>
  );
}
export default Order;
