import React from "react";
import Logo from "./assets/Logo/image.png";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout, theme } from "antd";
import Nav from "./components/Nav";
import Home from "./pages/Home/Home";
import Blog from "./pages/Blog/Blog";
import Category from "./pages/Category/Category";
import Order from "./pages/Order/Order";
import OrderN from "./pages/OrderN/OrderN";
import Product from "./pages/Product/Product";
import User from "./pages/User/User";
import Discount from "./pages/Discount/Discount";
import DiscountAdd from "./pages/Discount/Components/DiscountAdd";
import DiscountUpdate from "./pages/Discount/Components/DiscountUpdate";
import "./App.scss";
import { BsPersonCircle } from "react-icons/bs";
import ProductUpdate from "./pages/Product/commponents/ProductUpdate";
import ImpOrder from "./pages/OrderN/ImpOrder";
import TKSPBanChay from "./pages/Home/Components/TKSPBanChay";
import TKSPBanCham from "./pages/Home/Components/TKSPBanCham";
import UserUpdate from "./pages/User/components/UserUpdate";
const { Content, Footer, Sider } = Layout;

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <BrowserRouter>
      <Layout hasSider>
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "#ffffff",
            minWidth: "200px",
            padding: "10px",
          }}
        >
          <div
            className="demo-logo-vertical py-3"
            style={{ textAlign: "center" }}
          >
            <img src={Logo} style={{ width: "5.5rem", height: "4rem" }} />
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
            {" "}
            <BsPersonCircle className="fs-5 mb-2" /> Admin
          </div>

          <Nav />
        </Sider>
        <Layout
          style={{
            marginLeft: 250,
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
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Routes>
                <Route path="/discount" element={<Discount />} />
                <Route path="/discount/add" element={<DiscountAdd />} />
                <Route path="/discount-edit/:id" element={<DiscountUpdate />} />
                <Route path="/category" element={<Category />} />
                <Route path="/product" element={<Product />} />
                <Route path="/product-edit/:id" element={<ProductUpdate />} />
                <Route path="/user-edit/:id" element={<UserUpdate />} />

                <Route path="/blog" element={<Blog />} />
                <Route path="/order" element={<Order />} />
                <Route path="/order-nhap/add" element={<OrderN />} />
                <Route path="/order-nhap" element={<ImpOrder />} />

                <Route path="/user" element={<User />} />

                <Route path="/" element={<Home />} exact />
              </Routes>
            </div>
          </Content>
          {/* <Footer
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        Ant Design ©{new Date().getFullYear()} Created by Ant UED
                    </Footer> */}
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
