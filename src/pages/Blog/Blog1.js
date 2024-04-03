import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./Blog1.scss";
import { UploadOutlined } from "@ant-design/icons";
import { Input, Select, Button, Upload } from "antd";
import axios from "axios";
import draftToHtml from "draftjs-to-html";
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
const Blog1 = () => {
  const [categorys, setCategorys] = useState([]);
  const [id_category_selected, setIdCategorySelected] = useState();
  const [B_tieuDe, setB_tieuDe] = useState();
  const [is_loading, setLoading] = useState(false);
  const [file_images, setFileImages] = useState([]);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [valueEditor, setValueEditor] = useState("");
  useEffect(() => {
    getAllCategoryAndSupplier();
  }, []);
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    setValueEditor(
      convertToRaw(editorState.getCurrentContent()).blocks[0].text
    );
  };
  const getAllCategoryAndSupplier = async () => {
    try {
      const response = await axios.get("/api/admin/category-and-supplier");
      setCategorys(response.data.categorys);
    } catch (e) {
      console.error(e);
    }
  };
  // console.log("valueEditor", valueEditor);
  console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  const createBlog = async () => {
    setLoading(true);
    const contentAsHtml = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );

    const response = await axios.post("/api/admin/blog", {
      id_category_selected,
      B_tieuDe,
      valueEditor: contentAsHtml,
    });
    setLoading(false);
    setB_tieuDe("");
    setValueEditor("");
  };

  return (
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
            <Editor
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onEditorStateChange}
            />
          </div>
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
  );
};

export default Blog1;
