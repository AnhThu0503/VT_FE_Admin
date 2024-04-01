import "./Product.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button, Modal } from "antd";
import { useParams } from "react-router-dom";

const Product = () => {
  let navigate = useNavigate();
  const [falg, setFalg] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState();
  const [isModalOrderOpen, setIsModalOrderOpen] = useState(false);
  const [giabd, setGiabd] = useState();
  const [thoigia, setthoigia] = useState();
  const handleProductEdit = (record) => {
    navigate(`/product-edit/${record.key}`);
  };
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getAllProduct();
  }, [falg]);
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
    },
    {
      title: "TÊN SẢN PHẨM",
      dataIndex: "SP_ten",
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
        formattedData.push({
          key: item.SP_id,
          SP_id: item.SP_id,
          index: index + 1,
          SP_ten: item.SP_ten,
          SP_soLuong: item.SP_soLuong,
          SP_trongLuong: item.SP_trongLuong,
          SP_donViTinh: item.SP_donViTinh,
          SP_NSX: item.SP_NSX,
          SP_HSD: item.SP_HSD,
          SP_moTa: item.SP_moTa,
          SP_image: item.image,
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
        <p className="p-0 m-0">Mô tả: {detailProduct?.SP_moTa}</p>
        <img
          key={1}
          src={detailProduct?.SP_image ? detailProduct.SP_image : ""}
          alt="Hình ảnh sản phẩm"
          style={{ width: "100px", height: "100px" }}
        />
      </Modal>
    </div>
  );
};

export default Product;
