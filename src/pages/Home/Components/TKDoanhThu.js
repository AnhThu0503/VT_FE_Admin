import { Input, Button, Table } from "antd"; // Import Table component from antd
import axios from "axios";
import { useState } from "react";
import "./TKDoanhThu.scss";
const TKDoanhThu = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [doanhThu, setDoanhThu] = useState();

  const collectStatic = async () => {
    try {
      const response = await axios.get("/api/admin/collect", {
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      });
      console.log("collect>>>>", response.data);
      if (response.data) setDoanhThu(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  // Define columns for the table
  const columns = [
    {
      title: "Tháng",
      dataIndex: "Thang",
      key: "Thang",
    },
    {
      title: "Doanh thu",
      dataIndex: "DoanhThu",
      key: "DoanhThu",
    },
  ];

  return (
    <div className="container-doanhthu mt-4 pt-4">
      <h5 className="title-secon" style={{ textAlign: "left" }}>
        Doanh thu
      </h5>
      <div className=" pt-2">
        <div
          className="d-flex mx-auto"
          style={{ justifyContent: "space-between" }}
        >
          <div className="col-sm-4">
            <p className="startDate p-0 mb-2" style={{ textAlign: "left" }}>
              Ngày bắt đầu
            </p>
            <Input
              className="form-control"
              type="date"
              style={{ width: "100%" }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            ></Input>
          </div>
          <div className="col-sm-4">
            <p className="endDate p-0 mb-2" style={{ textAlign: "left" }}>
              Ngày kết thúc
            </p>
            <Input
              className="form-control"
              type="date"
              style={{ width: "100%" }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            ></Input>
          </div>
          <div className="text-end col-sm-2 mt-4">
            <Button
              onClick={collectStatic}
              size="large"
              className="btn-thongke"
            >
              Thống kê
            </Button>
          </div>
        </div>

        {/* Render the table */}
        <Table dataSource={doanhThu} columns={columns} className="mt-4" />
      </div>
    </div>
  );
};

export default TKDoanhThu;
