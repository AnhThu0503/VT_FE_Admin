import "./App.scss";
import React, { useEffect, useState } from "react";
import Logo from "./assets/Logo/image.png";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout, theme } from "antd";
import Nav from "./components/Nav";
import Home from "./pages/Home/Home";
import Category from "./pages/Category/Category";
import Order from "./pages/Order/Order";
import OrderN from "./pages/OrderN/OrderN";
import Product from "./pages/Product/Product";
import User from "./pages/User/User";
import Discount from "./pages/Discount/Discount";
import DiscountAdd from "./pages/Discount/Components/DiscountAdd";
import DiscountUpdate from "./pages/Discount/Components/DiscountUpdate";
import { BsPersonCircle } from "react-icons/bs";
import ProductUpdate from "./pages/Product/commponents/ProductUpdate";
import ImpOrder from "./pages/OrderN/ImpOrder";
import UserUpdate from "./pages/User/components/UserUpdate";
import CreateBlog from "./pages/Blog/components/CreateBlog";
import TKSPBanChay from "./pages/Home/Components/TKSPBanChay";
import TKSPBanCham from "./pages/Home/Components/TKSPBanCham";
import Blog from "./pages/Blog/Blog";
import UpdateBlog from "./pages/Blog/components/UpdateBlog";
import Suppliers from "./pages/Suppliers/Suppliers";
import TKSPTonKho from "./pages/Home/Components/TKSPTonKho";
import UserAdd from "./pages/User/components/UserAdd";
import Login from "./pages/Login/Login";
import TKDoanhThu from "./pages/Home/Components/TKDoanhThu";
import { Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Content, Sider } = Layout;

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  let token = "";

  useEffect(() => {
    token = localStorage.getItem("token");
  }, []);

  const [haveLogin, setHaveLogin] = useState(false);
  useEffect(() => {
    console.log("change token", token);
    token && setHaveLogin(true);
  }, [token]);

  const setLogin = (value) => {
    setHaveLogin(value);
  };

  return (
    <BrowserRouter>
      {haveLogin ? (
        <Layout hasSider style={{ height: "100vh" }}>
          <Sider
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
              backgroundColor: "#d6eadf",
              minWidth: "200px",
              padding: "10px",
            }}
          >
            <div
              className="demo-logo-vertical py-3"
              style={{ textAlign: "center" }}
            >
              <img src={Logo} style={{ width: "auto", height: "50px" }} />
            </div>
            <div
              className=" py-3"
              style={{
                textAlign: "center",
                fontSize: "1.3rem",
                borderTop: "1px solid #DCDCDC",
                borderBottom: "1px solid #DCDCDC",
              }}
            >
              <Avatar
                className="fs-5 mb-2 me-2"
                // style={{
                //   backgroundColor: "#87d068",
                // }}
                icon={<UserOutlined />}
              />
              Admin
            </div>

            <Nav />
          </Sider>
          <Layout
            style={{
              marginLeft: 270,
            }}
          >
            <Content
              style={{
                margin: "24px 16px 0",
                overflow: "initial",
              }}
            >
              <div
                style={{
                  padding: 24,
                  textAlign: "center",
                  borderRadius: borderRadiusLG,
                }}
              >
                <Routes>
                  <Route path="/discount" element={<Discount />} />
                  <Route path="/discount/add" element={<DiscountAdd />} />
                  <Route
                    path="/discount-edit/:id"
                    element={<DiscountUpdate />}
                  />
                  <Route path="/category" element={<Category />} />
                  <Route path="/supplier" element={<Suppliers />} />

                  <Route path="/product" element={<Product />} />
                  <Route path="/product-edit/:id" element={<ProductUpdate />} />
                  <Route path="/user-edit/:id" element={<UserUpdate />} />
                  <Route path="/blog-edit/:id" element={<UpdateBlog />} />
                  <Route path="/blog/add" element={<CreateBlog />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/order" element={<Order />} />
                  <Route path="/order-nhap/add" element={<OrderN />} />
                  <Route path="/order-nhap" element={<ImpOrder />} />
                  <Route path="/user-add" element={<UserAdd />} />

                  <Route path="/user" element={<User />} />
                  <Route path="/product-best" element={<TKSPBanChay />} />
                  <Route path="/product-slow" element={<TKSPBanCham />} />
                  <Route path="/product-stock" element={<TKSPTonKho />} />
                  <Route path="/static" element={<Home />} />

                  <Route path="/" element={<Home />} />
                  {/* <Route path="/" element={<Login />} exact /> */}
                </Routes>
              </div>
            </Content>
          </Layout>
        </Layout>
      ) : (
        <Login setLogin={setLogin} />
      )}
      ;
    </BrowserRouter>
  );
};

export default App;
