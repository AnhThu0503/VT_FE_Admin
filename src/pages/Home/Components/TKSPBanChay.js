import React, { useEffect, useState } from "react";
import "./TKSPBanChay.scss";
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
import axios from "axios";

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
      text: "Thống kê sản phẩm bán chạy",
    },
  },
};

const labels = ["Bán được", "Tồn kho"];

// // Actual data values
const dataset1Data = [200, 300, 400, 500, 600, 700, 800];
const dataset2Data = [300, 400, 500, 600, 700, 800, 900];

const dataBar = {
  label: "Bán được",
  data: [200, 300, 400, 500, 600, 700, 800],
  backgroundColor: "rgba(255, 99, 132, 0.5)",
};

export const data = {
  labels,
  datasets: [
    {
      label: "Bán được",
      data: dataset1Data,
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Tồn kho",
      data: dataset2Data,
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

function extractChartData(inputData) {
  // Initialize arrays to store data
  const data = [];

  // Extract data from productsOrder and productReceipt arrays
  const labels = [];
  const quantitiesSold = [];
  const quantitiesInStock = [];

  inputData.productsOrder.forEach((product) => {
    labels.push(product.ten);
    quantitiesSold.push(product.soluong);
  });

  inputData.productReceipt.forEach((product) => {
    quantitiesInStock.push(product.soluong);
  });

  // Construct data array with the desired format
  data.push({
    label: "Bán được",
    data: quantitiesSold,
    backgroundColor: "rgba(255, 99, 132, 0.5)",
  });

  data.push({
    label: "Tồn kho",
    data: quantitiesInStock,
    backgroundColor: "rgba(245, 222, 94, 0.8)",
  });

  return { data, labels };
}

// Input JSON data
const inputData = {
  productsOrder: [
    { ten: "banh pia me den", soluong: 8 },
    { ten: "banh pia", soluong: 4 },
  ],
  productReceipt: [
    { ten: "banh pia me den", soluong: 1 },
    { ten: "banh pia", soluong: 10 },
  ],
};

// Extracted data
const extractedData = extractChartData(inputData);
console.log("Extracted Data:", extractedData);

function TKSPBanChay() {
  const [datatest, setData] = useState();
  const [labesSet, setLabesSet] = useState();

  useEffect(() => {
    (async () => {
      const product = await axios.get("/api/admin/static");
      if (product.data) {
        const { data } = extractChartData(product.data);
        const { labels } = extractChartData(product.data);
        console.log(data);
        setLabesSet(labesSet);
        setData({
          labels: labels,
          datasets: data,
        });
      }
    })();
  }, []);

  return (
    <div className="col-sm-6 pe-4">
      <Bar options={options} data={datatest ? datatest : data} />
    </div>
  );
}

export default TKSPBanChay;
