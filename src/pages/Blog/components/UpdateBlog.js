import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Input, Select, message } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Upload } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "./UpdateBlog.scss";
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
const UpdateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categorys, setCategorys] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [B_tieuDe, setB_tieuDe] = useState();
  const [B_noiDung, setB_noiDung] = useState();
  const [id_category_selected, setIdCategorySelected] = useState();
  const [is_loading, setLoading] = useState(false);
  const [filelist, setfilelist] = useState();
  const [file_images, setFileImages] = useState([]);
  const [HAB_id, setHAB_id] = useState();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("/api/admin/blog/update", {
          B_id: id,
        });
        console.log(response.data);
        if (response.data) {
          setB_tieuDe(response.data.blog.B_tieuDe);
          setB_noiDung(response.data.blog.B_noiDung);
          setIdCategorySelected(response.data.blog.DMSP_id);
          setFileImages(response.data.blog.image);
          setHAB_id(response.data.blog.ID);
          setfilelist(response.data.blog.image);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchData();
  }, []);

  const onChangeFiles = async (info) => {
    let array_base = [];
    for (let file of info.fileList) {
      let temp = await readAsDataURL(file.originFileObj);
      array_base.push(temp);
    }
    setFileImages(array_base);
  };
  const updateBlog = async () => {
    setLoading(true);
    try {
      const response = await axios.put("/api/admin/blog/update", {
        B_id: id,
        B_tieuDe,
        B_noiDung,
        id_category_selected,
        file_images,
        HAB_id,
        filelist,
      });
      if (response.data) {
        messageApi.open({
          type: "success",
          content: "Cập nhật blog thành công!",
        });
        navigate("/blog");
        setLoading(false);
      } else {
        messageApi.open({
          type: "error",
          content: "Cập nhật blog thất bại!",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Cập nhật blog thất bại!",
      });
    }
  };

  return (
    <div className="container-update pb-4 mt-4">
      {contextHolder}

      <div className="title-primary text-center">Cập nhật Blog</div>
      <div className="mt-4 col-sm-12 mx-auto p-4">
        <div className="">
          <div className="col-sm-12 mb-4 ">
            <p className="title-blog m-0 p-0" style={{ textAlign: "left" }}>
              Tiêu đề blog:
            </p>
            <Input
              className="form-control"
              type="text"
              style={{ width: "fitContent" }}
              value={B_tieuDe}
              onChange={(e) => setB_tieuDe(e.target.value)}
            ></Input>
          </div>
          <div
            className="d-flex mb-2"
            style={{ justifyContent: "space-between" }}
          >
            <div className="d-flex col-sm-5">
              <div className="col-sm-3 text-start mt-4">
                <p className="title-blog m-0 p-0">Ảnh bìa blog:</p>
              </div>
              <div className="col-sm-4 text-start">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader col-sm-8"
                  showUploadList={false}
                  onChange={onChangeFiles}
                >
                  {file_images ? (
                    <img
                      src={file_images}
                      alt="avatar"
                      style={{
                        width: "100%",
                      }}
                    />
                  ) : (
                    <LoadingOutlined />
                  )}
                </Upload>
              </div>
            </div>
            <div className="col-sm-5 d-flex mt-4">
              <p className="title-blog m-0 p-0 me-2">Danh mục sản phẩm:</p>

              <Select
                className="m-0"
                size="large"
                onChange={(value) => setIdCategorySelected(value)}
                style={{ width: "fitContent" }}
                value={id_category_selected}
              >
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
                  value={B_noiDung}
                  onChange={setB_noiDung}
                ></ReactQuill>
              </div>
            </div>
          </div>

          <div className=" col-sm-12 mx-auto d-flex justify-content-end mt-4">
            {!is_loading ? (
              <Button
                className="btn btn-upload-blog"
                size="large"
                onClick={updateBlog}
              >
                Lưu
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
export default UpdateBlog;
