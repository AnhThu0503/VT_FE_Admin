import "./Home.scss";
import {
  BsBoxSeamFill,
  BsCartCheckFill,
  BsCalendar2DateFill,
  BsFillTagsFill,
} from "react-icons/bs";
import TKSPBanChay from "./Components/TKSPBanChay";
import TKSPBanCham from "./Components/TKSPBanCham";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input, Button } from "antd";
import TKDoanhThu from "./Components/TKDoanhThu";
import { BsCalendarX } from "react-icons/bs";

const Home = () => {
  const [numOrders, setNumOrders] = useState(0);
  const [numProducts, setNumProducts] = useState(0);
  const [numProductsHSD, setNumProductsHSD] = useState(0);
  const [numUsers, setNumUsers] = useState(0);
  const [numOrdersConfirm, setNumOrdersConfirm] = useState(0);
  useEffect(() => {
    countOrder();
    countProduct();
    countUser();
    countOrderConfirm();
    countProductsHSD();
  }, []);
  const countOrder = async () => {
    try {
      const response = await fetch("/api/admin/orders-count"); // Replace with your endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setNumOrders(data.numOrders);
    } catch (error) {
      console.error("Error fetching number of orders:", error);
    }
  };
  const countOrderConfirm = async () => {
    try {
      const response = await fetch("/api/admin/ordersConfirm-count"); // Replace with your endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setNumOrdersConfirm(data.numOrdersConfirm);
    } catch (error) {
      console.error("Error fetching number of orders:", error);
    }
  };
  const countProduct = async () => {
    try {
      const response = await fetch("/api/admin/products-count"); // Replace with your endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setNumProducts(data.numProducts);
    } catch (error) {
      console.error("Error fetching number of orders:", error);
    }
  };
  const countProductsHSD = async () => {
    try {
      const response = await fetch("/api/admin/products-count-hsd"); // Replace with your endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setNumProductsHSD(data.numProducts);
    } catch (error) {
      console.error("Error fetching number of orders:", error);
    }
  };
  const countUser = async () => {
    try {
      const response = await fetch("/api/admin/users-count"); // Replace with your endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setNumUsers(data.numUsers);
    } catch (error) {
      console.error("Error fetching number of users:", error);
    }
  };

  return (
    <div className="container-home container">
      <div className="title-primary pb-4">Thống kê</div>
      <div
        className="d-flex col-sm-12 "
        style={{ justifyContent: "space-between" }}
      >
        <div className="col-sm-3">
          <div
            className="box-tk py-3 px-2 d-flex "
            style={{
              boxShadow: "7px 7px 7px rgba(0, 0, 0, 0.2)",
              width: "90%",
            }}
          >
            <div className="col-sm-3 pt-4 pb-4">
              <BsBoxSeamFill
                className="fs-2 mt-3"
                style={{ color: "#20C2EE" }}
              />
            </div>
            <div className="col-sm-7">
              <p className="p-0 m-0 fs-2" style={{ color: "#20C2EE" }}>
                {numOrders}
              </p>
              <p className="p-0 m-0">Đơn hàng</p>
              <Link to="/order">Chi tiết</Link>
            </div>
          </div>
        </div>
        <div className="col-sm-3">
          <div
            className="box-tk py-3 px-2 me-2 d-flex "
            style={{
              boxShadow: "7px 7px 7px rgba(0, 0, 0, 0.2)",
              width: "90%",
            }}
          >
            <div className="col-sm-3 pt-4 pb-4">
              <BsCartCheckFill
                className="fs-2 mt-3"
                style={{ color: "#DB4B3F" }}
              />
            </div>
            <div className="col-sm-7">
              <p className="p-0 m-0 fs-2" style={{ color: "#DB4B3F" }}>
                {numOrdersConfirm}
              </p>
              <p className="p-0 m-0">Đơn hàng chờ xác nhận</p>
              <Link to="/order">Chi tiết</Link>
            </div>
          </div>
        </div>

        <div className="col-sm-3">
          <div
            className="box-tk py-3 px-2 me-2 d-flex "
            style={{
              boxShadow: "7px 7px 7px rgba(0, 0, 0, 0.2)",
              width: "90%",
            }}
          >
            <div className="col-sm-3 pt-4 pb-4">
              <BsFillTagsFill
                className="fs-2 mt-3"
                style={{ color: "#18A45F" }}
              />
            </div>
            <div className="col-sm-7">
              <p className="p-0 m-0 fs-2" style={{ color: "#18A45F" }}>
                {numProducts}
              </p>
              <p className="p-0 m-0">Sản phẩm</p>
              <Link to="/product">Chi tiết</Link>
            </div>
          </div>
        </div>

        <div className="col-sm-3">
          <div
            className=" box-tk py-3 px-2 me-2 d-flex "
            style={{
              boxShadow: "7px 7px 7px rgba(0, 0, 0, 0.2)",
              width: "90%",
            }}
          >
            <div className="col-sm-3 pt-4 pb-4">
              <BsCalendar2DateFill
                className="fs-2 mt-3"
                style={{ color: "#F19B30" }}
              />
            </div>
            <div className="col-sm-7">
              <p className="p-0 m-0 fs-2" style={{ color: "#F19B30" }}>
                {numProducts}
              </p>
              <p className="p-0 m-0">Sản phẩm hết HSD</p>
              <Link to="/product">Chi tiết</Link>
            </div>
          </div>
        </div>
      </div>

      <div className=" ">
        <TKDoanhThu />
      </div>
    </div>
  );
};
export default Home;
