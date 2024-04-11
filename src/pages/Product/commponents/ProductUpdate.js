import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "./ProductUpdate.scss";
import axios from "axios";
import { Button, message, Form, Input, Select } from "antd";
import { Upload } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { BsTrash } from "react-icons/bs";
import { UploadOutlined } from "@ant-design/icons";
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

const ProductUpdate = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [product, setProduct] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [images, setImages] = useState([]);
  const [id_category_selected, setIdCategorySelected] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const [file_images, setFileImages] = useState([]);
  const [file_imagesadd, setFileImagesadd] = useState([]);
  const [filelist, setfilelist] = useState();
  const [falg, setFalg] = useState(false);
  const [is_loading, setLoading] = useState(false);

  const navigation = useNavigate();
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
    const getProduct = async () => {
      try {
        const response = await axios.post("/api/admin/product/update", {
          SP_id: id,
        });
        if (response.data) {
          const { product, price, category, images } = response.data;
          form.setFieldsValue({
            SP_ten: product[0].SP_ten,
            SP_soLuong: product[0].SP_soLuong,
            SP_HSD: dayjs(product[0].SP_HSD).format("DD-MM-YYYY"),
            SP_NSX: dayjs(product[0].SP_NSX).format("DD-MM-YYYY"),
            G_thoiGia: price[0].G_thoiGia,
            SP_trongLuong: product[0].SP_trongLuong,
            SP_donViTinh: product[0].SP_donViTinh,
            SP_moTa: product[0].SP_moTa,
            DMSP_id: category[0].DMSP_id,
          });
          setIdCategorySelected(category[0].DMSP_id);

          // Map images array to include both HA_URL and HA_ID
          const fileImages = images.map((image) => ({
            HA_URL: image.HA_URL,
            HA_id: image.HA_id,
          }));

          setFileImages(fileImages);
          setfilelist(images);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getProduct();
  }, [falg]);

  useEffect(() => {}, [file_images]);
  const validateDate = (date) => {
    const dateString = date;
    const dateParts = dateString.split("-");
    const year = parseInt(dateParts[2]);
    const month = parseInt(dateParts[1]) - 1; // Months in JavaScript are zero-based
    const day = parseInt(dateParts[0]);
    const dateObject = new Date(year, month, day);
    const isoDateString = dateObject.toISOString();
    return isoDateString;
  };
  const onChangeFiles = async (info, index) => {
    const { fileList } = info;
    const newArray = [...file_images];

    // Check if there's an image uploaded
    if (fileList.length > 0) {
      const imageUrl = await readAsDataURL(fileList[0].originFileObj);
      const imageId = newArray[index].HA_id; // Access the HA_id from the file_images array
      const newImageObject = { HA_URL: imageUrl, HA_id: imageId }; // Create an object with HA_URL and HA_id
      newArray[index] = newImageObject; // Update the image object at the specified index
    } else {
      newArray[index] = null;
    }
    setFileImages(newArray, () => {
      console.log("file-iamges-change", file_images);
    });
  };
  const onChangeFilesAdd = async (info) => {
    let array_base = [];
    for (let file of info.fileList) {
      let temp = await readAsDataURL(file.originFileObj);
      array_base.push(temp);
    }
    setFileImagesadd(array_base);
  };
  const updateProduct = async (values) => {
    setLoading(true);

    try {
      const response = await axios.put("/api/admin/product/update", {
        SP_id: id,
        SP_ten: values.SP_ten,
        SP_soLuong: values.SP_soLuong,
        SP_donViTinh: values.SP_donViTinh,
        SP_NSX: validateDate(values.SP_NSX),
        SP_HSD: validateDate(values.SP_HSD),
        SP_trongLuong: values.SP_trongLuong,
        SP_moTa: values.SP_moTa,
        G_thoiGia: values.G_thoiGia,
        id_category_selected,
        file_images,
        filelist,
        file_imagesadd,
      });
      // console.log(response);
      if (response.data) {
        console.log("file_images updated", file_images);
        messageApi.open({
          type: "success",
          content: "Cập nhật sản phẩm thành công!",
        });
        setLoading(false);

        navigation("/product");
      } else {
        messageApi.open({
          type: "error",
          content: "Cập nhật sản phẩm thất bại!",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };
  const countImage = async (productId) => {
    try {
      const response = await axios.get("/api/admin/image/count", {
        params: {
          product_id: productId,
        },
      });
      const imageCount = response.data.image_count;
      console.log("imageCount", imageCount);
      // Check if there are fewer than or equal to 1 image associated with the product
      if (imageCount <= 1) {
        messageApi.open({
          type: "error",
          content: "Số lượng ảnh tối thiểu là 1!",
        });
        return false; // Indicate that deletion should not proceed
      }
      return true; // Indicate that deletion can proceed
    } catch (error) {
      console.error("Error occurred while counting images:", error);
      return false; // Indicate that deletion should not proceed due to error
    }
  };

  const deleteImage = async (HA_id, id) => {
    try {
      const canDelete = await countImage(id);
      if (!canDelete) return;

      const deleteResponse = await axios.delete("/api/admin/image/delete", {
        params: {
          HA_id: HA_id,
        },
      });

      if (deleteResponse.status === 200) {
        setFalg(!falg);
        messageApi.open({
          type: "success",
          content: "Xóa hình ảnh thành công!",
        });
      } else {
        messageApi.open({
          type: "error",
          content: "Xóa hình ảnh thất bại!",
        });
      }
    } catch (error) {
      console.error("Error occurred while deleting image:", error);
    }
  };

  return (
    <div className="container-upload pb-4 mt-4">
      {contextHolder}
      <div className="title-primary text-center">Cập nhật sản phẩm</div>
      <div className="mt-4">
        <Form
          className="col-sm-11 mx-auto"
          form={form}
          name="basic"
          layout="vertical"
          style={{}}
          initialValues={{
            remember: true,
          }}
          onFinish={updateProduct}
        >
          <div className="d-flex" style={{ justifyContent: "space-between" }}>
            <Form.Item
              label="Tên sản phẩm"
              name="SP_ten"
              className="col-sm-5"
              rules={[
                {
                  required: true,
                  message: "Vui lòng không để trống tên!",
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              className="col-sm-5"
              label="Danh mục sản phẩm"
              name="DMSP_id"
              rules={[
                {
                  required: true,
                  message: "Vui lòng không để trống danh mục sản phẩm!",
                },
              ]}
            >
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
            </Form.Item>
          </div>
          <div className="d-flex" style={{ justifyContent: "space-between" }}>
            <Form.Item
              label="Giá bán"
              name="G_thoiGia"
              className="col-sm-5"
              rules={[
                {
                  required: true,
                  message: "Vui lòng không để trống giá bán!",
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Số lượng"
              name="SP_soLuong"
              className="col-sm-5"
              rules={[
                {
                  required: true,
                  message: "Vui lòng không để trống số lượng!",
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </div>
          <div className="d-flex" style={{ justifyContent: "space-between" }}>
            <Form.Item
              label="Ngày sản xuất"
              name="SP_NSX"
              className="col-sm-5"
              rules={[
                {
                  required: true,
                  message: "Vui lòng không để trống ngày sản xuất!",
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              label="Hạn sử dụng"
              name="SP_HSD"
              className="col-sm-5"
              rules={[
                {
                  required: true,
                  message: "Vui lòng không để trống hạn sử dụng!",
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </div>
          <div className="d-flex" style={{ justifyContent: "space-between" }}>
            <Form.Item
              label="Trọng lượng"
              name="SP_trongLuong"
              className="col-sm-5"
              rules={[
                {
                  required: true,
                  message: "Vui lòng không để trống trọng lượng!",
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Đơn vị tính"
              name="SP_donViTinh"
              className="col-sm-5"
              rules={[
                {
                  required: true,
                  message: "Vui lòng không để trống đơn vị tính!",
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </div>
          <Form.Item
            label="Mô tả"
            name="SP_moTa"
            rules={[
              {
                required: true,
                message: "Vui lòng không để trống mô tả!",
              },
            ]}
          >
            <TextArea size="large" rows={3} />
          </Form.Item>

          <Form.Item>
            <div className=" col-sm-12 d-flex">
              {file_images ? (
                file_images.map((image, index) => (
                  <div key={image.HA_id} className="d-flex me-4 pe-4">
                    <div>
                      <Upload
                        name={`avatar_${index}`} // Unique name for each Upload component
                        listType="picture-card"
                        className="avatar-uploader col-sm-8"
                        showUploadList={false}
                        onChange={(info) => onChangeFiles(info, index)} // Pass index to onChange function
                      >
                        {image.HA_URL ? (
                          <img
                            src={image.HA_URL}
                            alt={`image_${index}`}
                            style={{ width: "100%" }}
                          />
                        ) : (
                          <LoadingOutlined />
                        )}
                      </Upload>
                    </div>
                    <div className="mt-4 pt-3">
                      <BsTrash
                        className="fs-5 btn-delete"
                        style={{ color: "red" }}
                        onClick={() => deleteImage(image.HA_id, id)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <LoadingOutlined />
              )}
            </div>
            <div className="col-sm-12 text-start">
              <Upload
                multiple={true}
                accept="image/*"
                onChange={onChangeFilesAdd}
              >
                <Button icon={<UploadOutlined />} size="large" className="my-3">
                  Thêm hình ảnh sản phẩm
                </Button>
              </Upload>
            </div>
          </Form.Item>

          <Form.Item>
            <div className="text-end">
              {!is_loading ? (
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  className="btn-upload-product"
                >
                  Lưu
                </Button>
              ) : (
                <Button type="primary" loading>
                  Loading
                </Button>
              )}
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default ProductUpdate;
