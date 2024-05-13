import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Menu } from "antd";
import {
  BsBarChartFill,
  BsFillPersonFill,
  BsListUl,
  BsCardHeading,
  BsBoxSeamFill,
  BsReceiptCutoff,
  BsTicketPerforated,
  BsFillTagsFill,
  BsTruck,
} from "react-icons/bs";
import { MdOutlineLogout } from "react-icons/md";
import "./Nav.scss";
import { UserContext } from "./context/userContext";
import React, { useContext, useEffect, useState } from "react";

const { SubMenu } = Menu;

const Nav = () => {
  const { user, logout } = useContext(UserContext);

  const handleLogout = () => {
    logout();
  };
  return (
    <Menu
      mode="inline"
      className="fs-6 menu-item mt-3"
      style={{
        backgroundColor: "#FFF1EB",
      }}
    >
      <SubMenu
        key="/"
        title={
          <span>
            <BsBarChartFill className="fs-5 mb-1 me-3" />
            Thống kê
          </span>
        }
      >
        <Menu.Item key="/static">
          <Link to="/static" style={{ textDecoration: "none" }}>
            Doanh thu
          </Link>
        </Menu.Item>
        <Menu.Item key="/product-best">
          <Link to="/product-best" style={{ textDecoration: "none" }}>
            Sản phẩm bán chạy
          </Link>
        </Menu.Item>
        <Menu.Item key="/product-slow">
          <Link to="/product-slow" style={{ textDecoration: "none" }}>
            Sản phẩm bán chậm
          </Link>
        </Menu.Item>
        <Menu.Item key="/product-stock">
          <Link to="/product-stock" style={{ textDecoration: "none" }}>
            Sản phẩm tồn kho
          </Link>
        </Menu.Item>
      </SubMenu>
      <Menu.Item key="/blog" className="py-4">
        <Link to="/blog" style={{ textDecoration: "none" }}>
          <BsCardHeading className="fs-5 mb-1 me-3" />
          Quản lý Blog
        </Link>
      </Menu.Item>
      <Menu.Item key="/discount" className="py-4">
        <Link to="/discount" style={{ textDecoration: "none" }}>
          <BsTicketPerforated className="fs-5 mb-1 me-3" />
          Quản lý khuyến mãi
        </Link>
      </Menu.Item>

      <Menu.Item key="/product" className="py-4">
        <Link to="/product" style={{ textDecoration: "none" }}>
          {" "}
          <BsFillTagsFill className="fs-5 mb-2 me-3" />
          Quản lý sản phẩm
        </Link>
      </Menu.Item>

      <Menu.Item key="/order" className="py-4">
        <Link to="/order" style={{ textDecoration: "none" }}>
          <BsBoxSeamFill className="fs-5 mb-2 me-3" />
          Quản lý đơn hàng
        </Link>
      </Menu.Item>
      <Menu.Item key="/order-nhap" className="py-4">
        <Link to="/order-nhap" style={{ textDecoration: "none" }}>
          <BsReceiptCutoff className="fs-5 mb-2 me-3" />
          Quản lý nhập hàng
        </Link>
      </Menu.Item>
      <Menu.Item key="/user" className="py-4">
        <Link to="/user" style={{ textDecoration: "none" }}>
          <BsFillPersonFill className="fs-5 mb-1 me-3" />
          Quản lý người dùng
        </Link>
      </Menu.Item>
      <Menu.Item key="/category" className="py-4">
        <Link to="/category" style={{ textDecoration: "none" }}>
          {" "}
          <BsListUl className="fs-5 mb-1 me-3" />
          Quản lý danh mục
        </Link>
      </Menu.Item>
      <Menu.Item key="/supplier" className="py-4">
        <Link to="/supplier" style={{ textDecoration: "none" }}>
          <BsTruck className="fs-5 mb-2 me-3" />
          Quản lý nhà cung cấp
        </Link>
      </Menu.Item>
      <Menu.Item key="/" className="py-4">
        <Link to="/" style={{ textDecoration: "none" }} onClick={handleLogout}>
          <MdOutlineLogout className="fs-5 mb-1 me-3" />
          Đăng xuất
        </Link>
      </Menu.Item>
    </Menu>
  );
};
export default Nav;
