import "./Home.scss";
import { BsBox, BsTags, BsPeople, BsCart3 } from "react-icons/bs";
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
        className="d-flex col-sm-12"
        style={{ justifyContent: "space-between" }}
      >
        <div className="col-sm-3 box d-flex ">
          <div
            className="col-sm-3 pt-4 pb-4"
            style={{ backgroundColor: "#20C2EE" }}
          >
            <BsBox className="fs-2 mt-2" style={{ color: "#ffffff" }} />
          </div>
          <div className="col-sm-7 " style={{ border: "1px solid #20C2EE" }}>
            <p className="p-0 m-0 fs-3">{numOrders}</p>
            <p className="p-0 m-0">Đơn hàng</p>
            <Link to="/order">Chi tiết</Link>
          </div>
        </div>
        <div className="col-sm-3 box d-flex ">
          <div
            className="col-sm-3 pt-4 pb-4"
            style={{ backgroundColor: "#DB4B3F" }}
          >
            <BsCart3 className="fs-2 mt-2" style={{ color: "#ffffff" }} />
          </div>
          <div className="col-sm-7 " style={{ border: "1px solid #DB4B3F" }}>
            <p className="p-0 m-0 fs-3">{numOrdersConfirm}</p>
            <p className="p-0 m-0">Đơn hàng chờ xác nhận</p>
            <Link to="/order">Chi tiết</Link>
          </div>
        </div>
        <div className="col-sm-3 box d-flex " style={{ justifyContent: "end" }}>
          <div
            className="col-sm-3 pt-4 pb-4"
            style={{ backgroundColor: "#18A45F" }}
          >
            <BsTags className="fs-2 mt-2" style={{ color: "#ffffff" }} />
          </div>
          <div className="col-sm-7 " style={{ border: "1px solid #18A45F" }}>
            <p className="p-0 m-0 fs-3">{numProducts}</p>
            <p className="p-0 m-0">Sản phẩm</p>
            <Link to="/product">Chi tiết</Link>
          </div>
        </div>
        <div className="col-sm-3 box d-flex " style={{ justifyContent: "end" }}>
          <div
            className="col-sm-3 pt-4 pb-4"
            style={{ backgroundColor: "#F19B30" }}
          >
            <BsCalendarX className="fs-2 mt-2" style={{ color: "#ffffff" }} />
          </div>
          <div className="col-sm-7 " style={{ border: "1px solid #F19B30" }}>
            <p className="p-0 m-0 fs-3">{numProductsHSD}</p>
            <p className="p-0 m-0">Sản phẩm hết HSD</p>
            <Link to="/product">Chi tiết</Link>
          </div>
        </div>
      </div>

      <div className="col-sm-12 mt-4 mb-4">
        <TKDoanhThu />
      </div>
    </div>
  );
};
export default Home;
