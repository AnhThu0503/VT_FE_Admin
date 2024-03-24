import "./Product.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button } from "antd";
import { useParams } from "react-router-dom";

const Product = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const [falg, setFalg] = useState(false);
  const handleProductEdit = (record) => {
    // Fixed function name here
    // history.push(`/product-edit/${record.key}`);
    // window.location.href = "/product-edit";
    navigate(`/product-edit/${record.key}`);
  };
  const [data, setData] = useState([]);
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
      dataIndex: "name",
      filters: [
        {
          text: "Bánh Pía",
          value: "Bánh Pía",
        },
        {
          text: "Bánh In",
          value: "Bánh In",
        },
        {
          text: "Bánh Hạnh Nhân",
          value: "Bánh Hạnh Nhân",
        },
        {
          text: "Kẹo",
          value: "Kẹo",
        },
        {
          text: "Bưởi",
          value: "Bưởi",
        },
        {
          text: "Khô",
          value: "Khô",
        },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.name.includes(value),
    },
    {
      title: "SỐ LƯỢNG",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "GIÁ BAN ĐẦU",
      dataIndex: "priceStart",
      sorter: (a, b) => a.priceStart - b.priceStart,
    },
    {
      title: "GIÁ BÁN",
      dataIndex: "thoigia",
      sorter: (a, b) => a.priceDiscount - b.priceDiscount,
    },
    {
      title: "",
      dataIndex: "",
      render: (text, record) => (
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
          <Button>Xem chi tiết</Button>
        </div>
      ),
    },
  ];

  // ProductUpdate

  const getAllProduct = async () => {
    try {
      const response = await axios.get("/api/admin/product");
      const formattedData = response.data.map((item, index) => ({
        key: item.SP_id,
        index: index + 1,
        name: item.SP_ten,
        quantity: item.SP_soLuong,
        priceStart: item.G_giaBanDau.toLocaleString("vi", {
          style: "currency",
          currency: "VND",
        }),
        thoigia: item.G_thoiGia.toLocaleString("vi", {
          style: "currency",
          currency: "VND",
        }),
      }));
      setData(formattedData);
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
  return (
    <div className="container-product">
      <div className="text-center title-primary pb-4">Quản lý sản phẩm</div>
      <Table columns={columns} dataSource={data} onChange={onChange} />
    </div>
  );
};

export default Product;
