import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button, message } from "antd";
import { notification } from "antd";
import { BsPlusCircle } from "react-icons/bs";
import "./Blog.scss";
const key = "updatable";
const Blog = () => {
  const [api, contextHolder] = notification.useNotification();
  let navigate = useNavigate();
  const [falg, setFalg] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const handleUpdateBlog = (record) => {
    navigate(`/blog-edit/${record.key}`);
  };
  useEffect(() => {
    getAllBlog();
  }, [falg]);
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
    },
    {
      title: "TIÊU ĐỀ BLOG",
      dataIndex: "B_tieuDe",
    },

    {
      title: "NGÀY TẠO",
      dataIndex: "B_ngayTao",
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
          <Button onClick={() => handleUpdateBlog(record)} type="primary" ghost>
            Cập nhật
          </Button>
          <Button
            className="ms-2"
            danger
            type="primary"
            ghost
            onClick={() => deleteBlog(record)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];
  const getAllBlog = async () => {
    try {
      const response = await axios.get("/api/admin/blogs");
      console.log("response data", response.data);
      let formattedData = [];
      response.data.forEach((item, index) => {
        formattedData.push({
          key: item.B_id,
          B_id: item.B_id,
          index: index + 1,
          B_tieuDe: item.B_tieuDe,
          B_ngayTao: formatDate(item.B_ngayTao),
          DMSP_ten: item.category.DMSP_ten,
        });
      });
      setBlogs(formattedData);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };
  const deleteBlog = async (record) => {
    try {
      const response = await axios.delete(`/api/admin/blog/delete`, {
        params: {
          B_id: record.key,
        },
      });
      if (response.status === 200) {
        api.open({
          key,
          type: "success",
          message: "Xóa blog thành công!",
        });
        setFalg(!falg);
      } else {
        api.open({
          key,
          type: "error",
          message: "Xóa blog thất bại!",
        });
      }
    } catch (error) {
      console.error("Error occurred while deleting blog:", error);
    }
  };
  const handleAddBlog = () => {
    navigate("/blog/add");
  };
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  function formatDate(dateObject) {
    const date = new Date(dateObject);
    const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits, pad with 0 if necessary
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed, so add 1
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  return (
    <div className="container-blog">
      {contextHolder}
      <div className="text-center title-primary pb-4">Quản lý Blog</div>
      <div className="text-end mb-4">
        <Button onClick={handleAddBlog} size="large" className="btn-add">
          Tạo Blog <BsPlusCircle className="fs-5 ms-2 mb-1" />
        </Button>
      </div>
      <Table columns={columns} dataSource={blogs} onChange={onChange} />
    </div>
  );
};
export default Blog;
