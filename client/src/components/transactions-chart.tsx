import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { groupTransactions } from "../lib/group-transactions";

export default function TransactionsChart({ period, year, month }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/transactions", { params: { year, month } }).then((res) => {
      const grouped = groupTransactions(res.data, period, year, month);
      setData(grouped);
    });
  }, [period, year, month]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="income" fill="#4CAF50" />
        <Bar dataKey="expenses" fill="#F44336" />
        <Bar dataKey="savings" fill="#2196F3" />
      </BarChart>
    </ResponsiveContainer>
  );
}