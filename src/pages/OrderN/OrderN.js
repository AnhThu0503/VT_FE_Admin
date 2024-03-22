import { useEffect, useState } from "react";
import "./OrderN.scss";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import { Select } from "antd";
import { Input } from "antd";
const { TextArea } = Input;

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
  const [donViTinh, setDonViTinh] = useState();
  const [soLuong, setSoLuong] = useState(1);
  const [tongTien, setTongTien] = useState();
  const [giaBan, setGiaBan] = useState(0);
  const [giaNhap, setGiaNhap] = useState();
  const [noiDung, setNoiDung] = useState();
  const [moTa, setMoTa] = useState();
  const [dmsp_id, setDMSPID] = useState(1);
  const [id_category_selected, setIdCategorySelected] = useState();
  const [id_supplier_selected, setIdsupplierSelected] = useState();
  const [file_images, setFileImages] = useState([]);
  const [is_loading, setLoading] = useState(false);

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

  const uploadProduct = async () => {
    setLoading(true);
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
      giaNhap,
      noiDung,
      moTa,
      dmsp_id,
      file_images,
    });
    setLoading(false);
    setName("");
    setTrongLuong(0);
    setTongTien(0);
    setGiaBan(0);
    setGiaNhap(0);
    setSoLuong(1);
    setNoiDung("");
    setMoTa("");
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
      <div className="title-primary text-center">Hóa đơn nhập hàng</div>
      <div className="row">
        <div className="m-auto p-auto">
          <div
            className="my-4 col-sm-11 m-auto d-flex"
            style={{ justifyContent: "end" }}
          >
            <Select
              onChange={(value) => setIdCategorySelected(value)}
              style={{ width: 180 }}
              defaultValue=""
              size="large"
              className="col-sm-2"
            >
              <Select.Option value="">Chọn danh mục</Select.Option>
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

            <Select
              onChange={(value) => setIdsupplierSelected(value)}
              style={{
                width: 180,
                marginLeft: "2rem",
              }}
              defaultValue=""
              size="large"
              className="col-sm-2"
            >
              <Select.Option value="">Chọn nhà cung cấp</Select.Option>
              {suppliers &&
                suppliers.map((supplier) => (
                  <Select.Option key={supplier.NCC_id} value={supplier.NCC_id}>
                    {supplier.NCC_ten}
                  </Select.Option>
                ))}
            </Select>
          </div>
          <div className="mb-3 col-sm-11 m-auto">
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
          <div
            className="d-flex col-sm-11 m-auto"
            style={{ justifyContent: "space-between" }}
          >
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
          <div
            className="col-sm-11 m-auto my-5 pb-3"
            style={{
              boxShadow: "0px 0px 3px 3px #999999",
            }}
          >
            <div className="py-4 title-secon">Thông tin sản phẩm</div>
            <div
              className="d-flex col-sm-10 mx-auto"
              style={{ justifyContent: "space-between" }}
            >
              <div className="mb-3 col-sm-5 ">
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
                className="col-sm-5 d-flex"
                style={{ justifyContent: "space-between" }}
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
            </div>

            <div
              className="d-flex col-sm-10 mb-3 mx-auto"
              style={{ justifyContent: "space-between" }}
            >
              <div className=" col-sm-5">
                <p className="product-NSX" style={{ textAlign: "left" }}>
                  Ngày sản xuất
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
                  Hạn sử dụng
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
              className="d-flex col-sm-10 m-auto"
              style={{ justifyContent: "space-between" }}
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

            <div className="mb-3 col-sm-10 m-auto">
              <p className="product-name" style={{ textAlign: "left" }}>
                Mô tả
              </p>
              <TextArea
                cols="30"
                rows="8"
                title=""
                className="col-sm-12"
                value={moTa}
                onChange={(e) => setMoTa(e.target.value)}
              ></TextArea>
            </div>
            <div className="col-sm-10 m-auto pb-3">
              <Upload multiple={true} accept="image/*" onChange={onChangeFiles}>
                <Button icon={<UploadOutlined />} size="large" className="my-3">
                  Click to Upload
                </Button>
              </Upload>
            </div>
          </div>

          <div className=" col-sm-11 mx-auto d-flex justify-content-end mb-3">
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
