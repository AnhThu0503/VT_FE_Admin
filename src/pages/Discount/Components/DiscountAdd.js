import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Select, Input } from "antd";
import "./DiscountUpdate.scss";
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
function DiscountAdd() {
  const [products, setProducts] = useState([]);
  const [KM_noiDung, setKM_noiDung] = useState();
  const [KM_ngayBatDau, setKM_ngayBatDau] = useState();
  const [KM_ngayKetThuc, setKM_ngayKetThuc] = useState();
  const [KM_mucGiamGia, setKM_mucGiamGia] = useState();
  const [id_product_selected, setIdProductSelected] = useState();
  const [is_loading, setLoading] = useState(false);

  useEffect(() => {
    getAllProductSelect();
  }, []);
  const getAllProductSelect = async () => {
    try {
      const response = await axios.get("/api/admin/products-select");
      setProducts(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const uploadDiscount = async () => {
    setLoading(true);
    const response = await axios.post("/api/admin/discount", {
      id_product_selected,
      KM_noiDung,
      KM_ngayBatDau,
      KM_ngayKetThuc,
      KM_mucGiamGia,
    });
    setLoading(false);
    setKM_noiDung("");
    setKM_mucGiamGia(0);
  };

  return (
    <div className="container-upload-discount pb-4">
      <div className="title-primary text-center">Tạo khuyến mãi</div>
      <div className="row">
        <div className=" col-sm-11 text-end mx-auto">
          <Select
            onChange={(value) => setIdProductSelected(value)}
            style={{ width: "fit-content" }}
            defaultValue=""
            className="col-sm-6"
          >
            <Select.Option value="">Chọn sản phẩm</Select.Option>
            {products &&
              products.map((product) => (
                <Select.Option key={product.SP_id} value={product.SP_id}>
                  {product.SP_ten}
                </Select.Option>
              ))}
          </Select>
        </div>
        <div className="mb-3 col-sm-11 m-auto">
          <p className="product-name" style={{ textAlign: "left" }}>
            Nội dung khuyến mãi
          </p>
          <TextArea
            cols="30"
            rows="3"
            title=""
            className="col-sm-12"
            value={KM_noiDung}
            onChange={(e) => setKM_noiDung(e.target.value)}
            required
          ></TextArea>
        </div>
        <div className="mb-3 col-sm-11 m-auto">
          <p className="startDate" style={{ textAlign: "left" }}>
            Ngày bắt đầu
          </p>
          <Input
            className="form-control"
            type="date"
            style={{ width: "100%" }}
            value={KM_ngayBatDau}
            onChange={(e) => setKM_ngayBatDau(e.target.value)}
          ></Input>
        </div>
        <div className="mb-3 col-sm-11 m-auto">
          <p className="endDate" style={{ textAlign: "left" }}>
            Ngày kết thúc
          </p>
          <Input
            className="form-control"
            type="date"
            style={{ width: "100%" }}
            value={KM_ngayKetThuc}
            onChange={(e) => setKM_ngayKetThuc(e.target.value)}
          ></Input>
        </div>
        <div className="mb-3 col-sm-11 m-auto">
          <p className="discountPrice" style={{ textAlign: "left" }}>
            Mức khuyến mãi
          </p>
          <Input
            className="form-control"
            type="number"
            style={{ width: "100%" }}
            value={KM_mucGiamGia}
            onChange={(e) => setKM_mucGiamGia(e.target.value)}
          ></Input>
        </div>
      </div>
      <div className=" col-sm-11 mx-auto d-flex justify-content-end mb-3">
        {!is_loading ? (
          <Button
            className="btn btn-upload-discount"
            size="large"
            onClick={uploadDiscount}
          >
            Thêm
          </Button>
        ) : (
          <Button type="primary" loading>
            Loading
          </Button>
        )}
      </div>
    </div>
  );
}
export default DiscountAdd;
