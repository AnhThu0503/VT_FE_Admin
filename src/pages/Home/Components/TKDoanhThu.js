import { Input, Button } from "antd"; // Import Table component from antd
import axios from "axios";
import { useState } from "react";
import "./TKDoanhThu.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Thống kê doanh thu",
    },
  },
};
const labels = ["Doanh thu"];
const dataset2Data = [0, 200, 400, 600, 800, 1000];
export const data = {
  labels,
  datasets: [
    {
      label: "Doanh thu",
      data: dataset2Data,
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const TKDoanhThu = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [labesSet, setLabesSet] = useState();
  const [datatest, setData] = useState();

  const collectStatic = async () => {
    try {
      const response = await axios.get("/api/admin/collect", {
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      });

      const { revenueArray } = response.data;

      const labels = revenueArray.map((entry) => entry.ngay);
      const data = revenueArray.map((entry) => entry.doanhThu);

      setData({
        labels: labels,
        datasets: [
          {
            label: "Doanh thu",
            data: data,
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };
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
      </div>
      <div className="col-sm-12">
        {" "}
        <Bar options={options} data={datatest ? datatest : data} />
      </div>
    </div>
  );
};

export default TKDoanhThu;
