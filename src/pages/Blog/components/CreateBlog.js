import React, { useState, useEffect, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Input, Select, Button, Upload } from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";

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
    setLoading(true);
    const response = await axios.post("/api/admin/blog", {
      id_category_selected,
      B_tieuDe,
      value,
      file_images,
    });
    setLoading(false);
    setB_tieuDe("");
    setValue("");
  };
  const onChangeFiles = async (info) => {
    let array_base = [];
    for (let file of info.fileList) {
      let temp = await readAsDataURL(file.originFileObj);
      array_base.push(temp);
    }
    setFileImages(array_base);
  };
  return (
    <div>
      <div className="container-blog pb-4">
        <div className="title-primary text-center">Tạo Blog</div>
        <div className="">
          <div
            className="col-sm-12 mb-4 d-flex "
            style={{ justifyContent: "space-between" }}
          >
            <div className="col-sm-5 ">
              <p className="title-blog" style={{ textAlign: "left" }}>
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
            <div className="col-sm-5 mt-4 text-end">
              <Select
                size="large"
                onChange={(value) => setIdCategorySelected(value)}
                style={{ width: "fitContent" }}
                defaultValue="Chọn danh mục liên quan"
              >
                <Select.Option value="">Chọn danh mục liên quan</Select.Option>
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
          <div className="description-blog">
            <p className="description-blog" style={{ textAlign: "left" }}>
              Nội dung blog:
            </p>
            <div style={{ border: "1px solid red" }}>
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
          <div className="col-sm-10 m-auto pb-3">
            <p className="img-blog" style={{ textAlign: "left" }}>
              Ảnh bìa blog:
            </p>
            <Upload multiple={true} accept="image/*" onChange={onChangeFiles}>
              <Button icon={<UploadOutlined />} size="large" className="my-3">
                Click to Upload
              </Button>
            </Upload>
          </div>

          <div className=" col-sm-11 mx-auto d-flex justify-content-end mb-3">
            {!is_loading ? (
              <Button
                className="btn btn-upload-product"
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
