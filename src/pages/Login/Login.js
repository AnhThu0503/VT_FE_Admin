import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Input, notification, message } from "antd";
import axios from "axios";
import "./Login.scss";
import logo from "../../assets/Logo/image.png";
import { UserContext } from "../../components/context/userContext";
const key = "updatable";
const Login = ({ setLogin }) => {
  // const dispatch = useDispatch();

  // const thirdPartyLoginHandler = ({ response, provider, error }) => {
  //   console.log(" response>>", response);
  //   console.log(" provider>>", provider);
  //   console.log(" error>>", error);
  //   dispatch(login({ user: response, provider, error }));
  // };

  // const successResponseGoogle = (response) => {
  //   thirdPartyLoginHandler({
  //     error: false,
  //     provider: "google",
  //     response: response.profileObj,
  //   });
  // };
  // const failResponseGoogle = (response) =>
  //   thirdPartyLoginHandler({ error: true, provider: "google", response: {} });

  const { user, logout, setUser, authLogin } = useContext(UserContext);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = async (values) => {
    const response = await axios.post("/api/admin/login", values);
    console.log("auth login ", response.data);
    if (response.data.success) {
      localStorage.setItem("token", response.data.token);

      messageApi.open({
        type: "success",
        content: "Đăng nhập thành công",
      });
      // window.location.href = "/";
      setLogin(true);
      navigate("/");
    } else {
      messageApi.open({
        type: "error",
        content: "Đăng nhập thất bại",
      });
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="login-container " style={{ paddingTop: "4.5rem" }}>
      {/* <div>
          <GoogleLogin
            clientId="831985335025-l14foqiec2jj5omc3evf2c3p0lpv8fio.apps.googleusercontent.com"
            signInFlow="redirect"
            onSuccess={successResponseGoogle}
            onFailure={failResponseGoogle}
            cookiePolicy={"single_host_origin"}
            render={(renderProps) => (
              <button onClick={renderProps.onClick}>Login with Google</button>
            )}
          />
        </div> */}
      <div className="container">
        <div className="row">
          {contextHolder}
          <div className="login-content col-sm-6 py-3 mx-auto">
            <div className="text-center text-login ">Đăng nhập</div>
            <Form
              name="basic"
              layout="vertical"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email!",
                  },
                ]}
              >
                <Input type="email" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item className="text-center">
                <Button
                  className="btn-login"
                  style={{ width: "100%" }}
                  type="primary"
                  htmlType="submit"
                >
                  Đăng nhập
                </Button>
              </Form.Item>
              <Form.Item className="text-center mt-4 pt-4">
                <img
                  src={logo}
                  className=""
                  style={{ width: "auto", height: "60px" }}
                ></img>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
