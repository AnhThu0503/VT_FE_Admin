import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Table, Button, Input, Space } from "antd";
import "./Category.scss";
import { notification } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const key = "updatable";

function Category() {
  const [name, setName] = useState();
  const [categorys, setCategorys] = useState([]);
  const [falg, setFalg] = useState(false);
  const [api, contextHolder] = notification.useNotification();
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
  const uploadProductCategory = async () => {
    try {
      const response = await axios.post("/api/admin/category", {
        name,
      });
      if (response.data) {
        api.open({
          key,
          type: "success",
          message: "Tạo danh mục sản phẩm thành công!",
        });
        setFalg(!falg);
        setName("");
      } else {
        api.open({
          key,
          type: "error",
          message: "Tạo danh mục sản phẩm thất bại!",
        });
      }
    } catch (e) {
      api.open({
        key,
        type: "error",
        message: "Tạo danh mục sản phẩm thất bại!",
      });
    }
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
          placeholder={`Tìm danh mục`}
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
      title: "TÊN DANH MỤC",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
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
        api.open({
          key,
          type: "success",
          message: "Xóa danh mục sản phẩm thành công!",
        });
        setFalg(!falg);
      } else {
        console.log("Failed to delete category");
        api.open({
          key,
          type: "error",
          message: "Xóa danh mục sản phẩm thất bại!",
        });
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
      {contextHolder}

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
