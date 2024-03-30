import axios from "axios";
import { useEffect, useState } from "react";
import { Table, Button, Input } from "antd";
import "./Category.scss";
function Category() {
  const [name, setName] = useState();
  const [categorys, setCategorys] = useState([]);
  const [falg, setFalg] = useState(false);

  const uploadProductCategory = async () => {
    const response = await axios.post("/api/admin/category", {
      name,
    });
    setFalg(!falg);
  };
  useEffect(() => {
    getAllCategory();
  }, [falg]);
  const getAllCategory = async () => {
    try {
      const response = await axios.get("/api/admin/category");
      const formattedData = response.data.map((item, index) => ({
        key: item.DMSP_id,
        index: index + 1,
        name: item.DMSP_ten,
      }));
      setCategorys(formattedData);
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
      title: "TÊN DANH MỤC",
      dataIndex: "name",
      filters: [
        {
          text: "Bánh",
          value: "Bánh",
        },
        {
          text: "Hoa Quả",
          value: "Hoa quả",
        },
        {
          text: "Lạp xưởng",
          value: "Lạp xưởng",
        },
        {
          text: "khô",
          value: "khô",
        },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.name.includes(value),
    },
    {
      title: "",
      dataIndex: "",
      render: (text, record) => (
        <div style={{ textAlign: "right" }}>
          <Button
            className="mx-2"
            type="primary"
            onClick={() => deleteCategory(record)}
            danger
            ghost
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];
  const deleteCategory = async (record) => {
    try {
      console.log(record);
      // Make a DELETE request to your backend API endpoint
      const response = await axios.delete(`/api/admin/category/delete`, {
        params: {
          DMSP_id: record.key,
        },
      });

      // Check if the request was successful
      if (response.status === 200) {
        console.log("Category deleted successfully");
        setFalg(!falg);
      } else {
        console.log("Failed to delete category");
        // Optionally, you can return false to indicate failure
      }
    } catch (error) {
      console.error("Error occurred while deleting category:", error);
    }
  };
  const onChangeTable = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  return (
    <div className="container-category">
      <div className="text-center title-primary pb-4">Quản lý danh mục</div>
      <div className="col-sm-6 pb-4" style={{ textAlign: "left" }}>
        <Input
          size="large"
          placeholder="Nhập tên danh mục"
          style={{ width: "70%", borderRadius: "0" }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          onClick={uploadProductCategory}
          className="btn-upload-category"
          size="large"
          style={{ borderRadius: "0" }}
        >
          Thêm
        </Button>
      </div>
      <Table
        className="col-sm-12"
        columns={columns}
        dataSource={categorys}
        onChange={onChangeTable}
      />
    </div>
  );
}
export default Category;
