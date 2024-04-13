import React, { useState, useEffect, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Input, Select, Button, Upload, message } from "antd";
import axios from "axios";
import "./CreateBlog.scss";
import { PlusOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";

const key = "updatable";

async function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsDataURL(file);
  });
}
const CreateBlog = () => {
  const [value, setValue] = useState("");
  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],
    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction
    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
    ["clean"], // remove formatting button
  ];
  const [categorys, setCategorys] = useState([]);
  const [id_category_selected, setIdCategorySelected] = useState();
  const [B_tieuDe, setB_tieuDe] = useState();
  const [is_loading, setLoading] = useState(false);
  const [file_images, setFileImages] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const module = {
    toolbar: toolbarOptions,
  };

  useEffect(() => {
    getAllCategoryAndSupplier();
  }, []);
  const getAllCategoryAndSupplier = async () => {
    try {
      const response = await axios.get("/api/admin/category-and-supplier");
      setCategorys(response.data.categorys);
    } catch (e) {
      console.error(e);
    }
  };
  const createBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/admin/blog", {
        id_category_selected,
        B_tieuDe,
        value,
        file_images,
      });
      if (response.data) {
        api.open({
          key,
          type: "success",
          message: "Tạo blog thành công!",
        });

        setLoading(false);
        setB_tieuDe("");
        setValue("");
        navigate("/blog");
      } else {
        api.open({
          key,
          type: "error",
          message: "Tạo blog nhập thất bại!",
        });
      }
    } catch (e) {
      api.open({
        key,
        type: "error",
        message: "Tạo blog nhập thất bại!",
      });
    }
  };
  const onChangeFiles = async (info) => {
    let array_base = [];
    for (let file of info.fileList) {
      let temp = await readAsDataURL(file.originFileObj);
      array_base.push(temp);
    }
    setFileImages(array_base);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  return (
    <div>
      <div className="container-blog pb-4">
        {contextHolder}

        <div className="title-primary text-center">Tạo Blog</div>
        <div className="">
          <div
            className="col-sm-12 mb-4 d-flex "
            style={{ justifyContent: "space-between" }}
          >
            <div className="col-sm-5 ">
              <p className="title-blog m-0 p-0" style={{ textAlign: "left" }}>
                Tiêu đề blog:
              </p>
              <Input
                className="form-control"
                type="text"
                style={{ width: "100%" }}
                value={B_tieuDe}
                onChange={(e) => setB_tieuDe(e.target.value)}
              ></Input>
            </div>
            <div className="col-sm-5 text-start mt-4">
              <Select
                size="large"
                onChange={(value) => setIdCategorySelected(value)}
                style={{ width: "fitContent" }}
                className=""
                defaultValue="Chọn danh mục sản phẩm"
              >
                <Select.Option value="">Chọn danh mục sản phẩm</Select.Option>
                {categorys &&
                  categorys.map((category) => (
                    <Select.Option
                      key={category.DMSP_id}
                      value={category.DMSP_id}
                    >
                      {category.DMSP_ten}
                    </Select.Option>
                  ))}
              </Select>
            </div>
          </div>

          <div className="col-sm-5 text-start">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader col-sm-8"
              showUploadList={false}
              onChange={onChangeFiles}
            >
              {file_images.length >= 1 ? (
                <img
                  src={file_images}
                  style={{
                    width: "100%",
                  }}
                  alt="Thêm ảnh bìa"
                />
              ) : (
                <div>
                  <PlusOutlined />
                  <div>Thêm ảnh bìa</div>
                </div>
              )}
            </Upload>
          </div>

          <div className="description-blog mt-2">
            <p
              className="description-blog m-0 p-0"
              style={{ textAlign: "left" }}
            >
              Nội dung blog:
            </p>
            <div>
              <div>
                <ReactQuill
                  modules={module}
                  theme="snow"
                  value={value}
                  onChange={setValue}
                ></ReactQuill>
              </div>
            </div>
          </div>

          <div className=" col-sm-12 mx-auto d-flex justify-content-end mt-4">
            {!is_loading ? (
              <Button
                className="btn btn-upload-blog"
                size="large"
                onClick={createBlog}
              >
                Đăng bài
              </Button>
            ) : (
              <Button type="primary" loading>
                Loading
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateBlog;
