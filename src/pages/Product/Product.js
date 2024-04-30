import "./Product.scss";
import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button, Modal, Input, Space } from "antd";
import { useParams } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const Product = () => {
  let navigate = useNavigate();
  const [falg, setFalg] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState();
  const [isModalOrderOpen, setIsModalOrderOpen] = useState(false);
  const [giabd, setGiabd] = useState();
  const [thoigia, setthoigia] = useState();
  const [moTa, setMoTa] = useState();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const handleProductEdit = (record) => {
    navigate(`/product-edit/${record.key}`);
  };
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProduct();
  }, [falg]);
  const validateDate = (date) => {
    const dateString = date;
    const dateParts = dateString.split("-");
    const year = parseInt(dateParts[2]);
    const month = parseInt(dateParts[1]) - 1; // Months in JavaScript are zero-based
    const day = parseInt(dateParts[0]);
    const dateObject = new Date(year, month, day);
    const isoDateString = dateObject.toISOString();

    return isoDateString;
  };
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
          placeholder={`Tìm sản phẩm`}
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
    },
    {
      title: "TÊN SẢN PHẨM",
      dataIndex: "SP_ten",
      key: "SP_ten",
      ...getColumnSearchProps("SP_ten"),
    },
    {
      title: "SỐ LƯỢNG",
      dataIndex: "SP_soLuong",
      sorter: (a, b) => a.SP_soLuong - b.SP_soLuong,
    },
    {
      title: "GIÁ BAN ĐẦU",
      dataIndex: "giaBanDau",
    },
    {
      title: "GIÁ BÁN",
      dataIndex: "thoiGia",
    },
    {
      title: "HSD",
      dataIndex: "SP_HSD",
    },
    {
      title: "DANH MỤC SẢN PHẨM",
      dataIndex: "DMSP_ten",
    },
    {
      title: "",
      dataIndex: "",
      render: (_, record) => (
        <div style={{ textAlign: "right" }}>
          {" "}
          <Button onClick={() => handleProductEdit(record)}>Cập nhật</Button>
          <Button
            onClick={() => deleteProduct(record)}
            className="mx-2"
            type="primary"
            danger
            ghost
          >
            Xóa
          </Button>
          <Button
            onClick={() => {
              console.log(record);
              setDetailProduct(record);
              showModal(record);
            }}
          >
            Xem chi tiết
          </Button>
        </div>
      ),
    },
  ];

  // ProductUpdate

  const getAllProduct = async () => {
    try {
      const response = await axios.get("/api/admin/product");
      console.log("response data", response.data);
      let formattedData = [];
      response.data.products.forEach((item, index) => {
        setMoTa(item.SP_moTa);
        console.log("item.images", item.images);
        formattedData.push({
          key: item.SP_id,
          SP_id: item.SP_id,
          index: index + 1,
          SP_ten: item.SP_ten,
          SP_soLuong: item.SP_soLuong,
          SP_trongLuong: item.SP_trongLuong,
          SP_donViTinh: item.SP_donViTinh,
          SP_NSX: item.SP_NSX,
          SP_HSD: dayjs(item.SP_HSD).format("DD-MM-YYYY"),
          SP_moTa: item.SP_moTa,
          SP_image: item.images,
          DMSP_ten: item.category.DMSP_ten,
          SP_giaBanDau: item.G_giaBanDau,
          SP_thoiGia:
            item.discount && item.discount.KM_mucGiamGia
              ? item.price - item.discount.KM_mucGiamGia
              : item.price,
          giaBanDau: item.G_giaBanDau.toLocaleString("vi", {
            style: "currency",
            currency: "VND",
          }),
          thoiGia:
            item.discount && item.discount.KM_mucGiamGia
              ? (item.price - item.discount.KM_mucGiamGia).toLocaleString(
                  "vi",
                  {
                    style: "currency",
                    currency: "VND",
                  }
                )
              : item.price.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                }),
        });
      });

      setProducts(formattedData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProduct = async (record) => {
    try {
      console.log(record);
      // Make a DELETE request to your backend API endpoint
      const response = await axios.delete(`/api/admin/product/delete`, {
        params: {
          SP_id: record.key,
        },
      });

      // Check if the request was successful
      if (response.status === 200) {
        console.log("Product deleted successfully");
        setFalg(!falg);
      } else {
        console.log("Failed to delete product");
        // Optionally, you can return false to indicate failure
      }
    } catch (error) {
      console.error("Error occurred while deleting product:", error);
    }
  };
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
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
  function formatDate(dateObject) {
    const date = new Date(dateObject);
    const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits, pad with 0 if necessary
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed, so add 1
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  console.log(detailProduct);
  return (
    <div className="container-product">
      <div className="text-center title-primary pb-4">Quản lý sản phẩm</div>
      <Table columns={columns} dataSource={products} onChange={onChange} />

      <Modal
        title="Chi tiết sản phẩm"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p className="p-0 m-0">Tên sản phẩm: {detailProduct?.SP_ten}</p>
        <p className="p-0 m-0">
          {" "}
          Trọng lượng: {detailProduct?.SP_trongLuong}{" "}
          {detailProduct?.SP_donViTinh}
        </p>
        <p
          className="p-0 m-0 mota"
          dangerouslySetInnerHTML={{ __html: moTa }}
        />
        {detailProduct?.SP_image &&
          detailProduct.SP_image.map((image, index) => (
            <img
              className="mx-1"
              key={1}
              src={image.HA_URL ? image.HA_URL : ""}
              alt="Hình ảnh sản phẩm"
              style={{ width: "100px", height: "80px" }}
            />
          ))}
      </Modal>
    </div>
  );
};

export default Product;
