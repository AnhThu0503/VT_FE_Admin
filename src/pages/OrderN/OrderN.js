import { useEffect, useState } from "react";
import "./OrderN.scss";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import { Select } from "antd";
import { Input } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
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

function OrderN() {
  const [categorys, setCategorys] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState();
  const [NSX, setNSX] = useState();
  const [HSD, setHSD] = useState();
  const [trongLuong, setTrongLuong] = useState();
  // eslint-disable-next-line no-unused-vars
  const [donViTinh, setDonViTinh] = useState();
  const [soLuong, setSoLuong] = useState(1);
  const [tongTien, setTongTien] = useState();
  const [giaBan, setGiaBan] = useState(0);
  const [giaNhap, setGiaNhap] = useState();
  const [ngayNhap, setNgayNhap] = useState(getCurrentDate());
  const [noiDung, setNoiDung] = useState();
  const [moTa, setMoTa] = useState("");
  const [dmsp_id, setDMSPID] = useState(1);
  const [id_category_selected, setIdCategorySelected] = useState();
  const [id_supplier_selected, setIdsupplierSelected] = useState();
  const [file_images, setFileImages] = useState([]);
  const [is_loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ["link", "formula"],
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
      setSuppliers(response.data.suppliers);
    } catch (e) {
      console.error(e);
    }
  };
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const uploadProduct = async () => {
    try {
      setLoading(true);
      console.log("id_category_selected", id_category_selected);
      console.log("id_supplier_selected", id_supplier_selected);

      const response = await axios.post("/api/admin/product", {
        id_category_selected,
        id_supplier_selected,
        name,
        NSX,
        HSD,
        trongLuong,
        donViTinh,
        soLuong,
        tongTien,
        giaBan,
        ngayNhap,
        giaNhap,
        noiDung,
        moTa,
        dmsp_id,
        file_images,
      });
      if (response.data) {
        api.open({
          key,
          type: "success",
          message: "Tạo hóa đơn nhập thành công!",
        });
        setLoading(false);
        setName("");
        setTrongLuong(0);
        setTongTien(0);
        setGiaBan(0);
        setGiaNhap(0);
        setSoLuong(10);
        setNoiDung("");
        setFileImages([]); // Clear the file_images state
        setMoTa("");
        navigate("/order-nhap");
      } else {
        api.open({
          key,
          type: "error",
          message: "Tạo hóa đơn nhập thất bại!",
        });
      }
    } catch (e) {
      api.open({
        key,
        type: "error",
        message: "Tạo hóa đơn nhập thất bại!",
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

  const calculateTotalPrice = () => {
    const totalPrice = giaNhap * soLuong;
    setTongTien(totalPrice);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [giaNhap, soLuong]);

  return (
    <div className="container-upload pb-4">
      {contextHolder}
      <div className="title-primary textcenter">Hóa đơn nhập hàng</div>
      <div className="row ">
        <div className="col-sm-5  mx-auto ">
          <div className="title-secon">Thông tin sản phẩm</div>

          <div className="pb-2" style={{ width: "100%" }}>
            <p className="product-name" style={{ textAlign: "left" }}>
              Tên sản phẩm
            </p>
            <Input
              className="form-control"
              type="text"
              style={{ width: "100%" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Input>
          </div>
          <div
            className="d-flex pb-2"
            style={{ justifyContent: "space-between", width: "100%" }}
          >
            <div className="col-sm-5">
              <p className="product-name" style={{ textAlign: "left" }}>
                Giá nhập
              </p>
              <Input
                className="form-control"
                type="number"
                style={{ width: "100%" }}
                value={giaNhap}
                onChange={(e) => {
                  setGiaNhap(e.target.value);
                }}
              ></Input>
            </div>
            <div className="col-sm-5">
              <p className="product-name" style={{ textAlign: "left" }}>
                Giá bán
              </p>
              <Input
                className="form-control"
                type="number"
                style={{ width: "100%" }}
                value={giaBan}
                onChange={(e) => setGiaBan(e.target.value)}
              ></Input>
            </div>
          </div>
          <div
            className="d-flex pb-2"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <div className=" col-sm-5">
              <p className="product-NSX" style={{ textAlign: "left" }}>
                Ngày thu hoạch
              </p>
              <Input
                className="form-control"
                type="date"
                style={{ width: "100%" }}
                value={NSX}
                onChange={(e) => setNSX(e.target.value)}
              ></Input>
            </div>
            <div className=" col-sm-5">
              <p className="product-HSD" style={{ textAlign: "left" }}>
                Thời gian bảo quản
              </p>
              <Input
                className="form-control"
                type="date"
                style={{ width: "100%" }}
                value={HSD}
                onChange={(e) => setHSD(e.target.value)}
              ></Input>
            </div>
          </div>
          <div
            className="d-flex"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <div className="mb-3 col-sm-5">
              <p className="product-" style={{ textAlign: "left" }}>
                Trọng lượng
              </p>
              <Input
                className="form-control"
                type="number"
                style={{ width: "100%" }}
                value={trongLuong}
                onChange={(e) => setTrongLuong(e.target.value)}
              ></Input>
            </div>
            <div className="mb-3 col-sm-5 ">
              <p className="product-name" style={{ textAlign: "left" }}>
                Đơn vị tính
              </p>
              <Input
                className="form-control"
                type="text"
                style={{ width: "100%" }}
                value={donViTinh}
                onChange={(e) => setDonViTinh(e.target.value)}
              ></Input>
            </div>
          </div>
          <div style={{ width: "100%" }}>
            <p className="product-name" style={{ textAlign: "left" }}>
              Mô tả
            </p>

            <ReactQuill
              modules={module}
              theme="snow"
              value={moTa}
              onChange={setMoTa}
            ></ReactQuill>
          </div>
          <div style={{ width: "100%" }}>
            <Upload multiple={true} accept="image/*" onChange={onChangeFiles}>
              <Button icon={<UploadOutlined />} size="large" className="my-3">
                Click to Upload
              </Button>
            </Upload>
          </div>
        </div>
        <div className="col-sm-5 mx-auto mt-4">
          <div
            className="d-flex pb-2"
            style={{ justifyContent: "space-between" }}
          >
            <div className="col-sm-5">
              <p className="ngayNhap" style={{ textAlign: "left" }}>
                Danh mục
              </p>
              <Select
                onChange={(value) => setIdCategorySelected(value)}
                style={{ width: "100%" }}
                size="large"
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
            <div className="col-sm-5">
              <p className="ngayNhap me-4">Nhà cung cấp</p>
              <Select
                onChange={(value) => setIdsupplierSelected(value)}
                style={{
                  width: "100%",
                }}
                size="large"
              >
                {suppliers &&
                  suppliers.map((supplier) => (
                    <Select.Option
                      key={supplier.NCC_id}
                      value={supplier.NCC_id}
                    >
                      {supplier.NCC_ten}
                    </Select.Option>
                  ))}
              </Select>
            </div>
          </div>
          <div className="pb-2" style={{ width: "100%" }}>
            <p className="ngayNhap" style={{ textAlign: "left" }}>
              Ngày nhập hàng
            </p>
            <Input
              className="form-control"
              type="date"
              style={{ width: "100%" }}
              value={ngayNhap}
              onChange={(e) => setNgayNhap(e.target.value)}
            ></Input>
          </div>
          <div style={{ width: "100%" }}>
            <p className="product-name" style={{ textAlign: "left" }}>
              Nội dung nhập hàng
            </p>
            <TextArea
              cols="30"
              rows="3"
              title=""
              className="col-sm-12"
              value={noiDung}
              onChange={(e) => setNoiDung(e.target.value)}
            ></TextArea>
          </div>
          <div className="d-flex" style={{ justifyContent: "space-between" }}>
            <div className=" col-sm-5">
              <p className="product-name" style={{ textAlign: "left" }}>
                Số lượng
              </p>
              <Input
                className="form-control"
                type="number"
                style={{ width: "100%" }}
                value={soLuong}
                onChange={(e) => {
                  setSoLuong(e.target.value);
                }}
              ></Input>
            </div>
            <div className="mb-3 col-sm-5">
              <p className="product-name" style={{ textAlign: "left" }}>
                Tổng tiền
              </p>
              <Input
                className="form-control"
                type="number"
                style={{ width: "100%" }}
                value={tongTien}
                readOnly
              ></Input>
            </div>
          </div>
          <div className="  d-flex justify-content-end mb-3">
            {!is_loading ? (
              <Button
                className="btn btn-upload-product"
                size="large"
                onClick={uploadProduct}
              >
                Đăng
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
}
export default OrderN;
