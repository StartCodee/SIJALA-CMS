import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import { scalePoint } from "framer-motion";



export default function EvikaPage() {
  const [excelData, setExcelData] = useState([]);
  const [scoreResult, setScoreResult] = useState(null);

  console.log("Excel Data:", scoreResult);

    const handleExcelUpload = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const rawData = XLSX.utils.sheet_to_json(worksheet, { range: 1 });

            const jsonData = rawData.map(row => {
            const newRow = {};

            Object.keys(row).forEach(key => {
                const cleanKey = key.trim(); 
                newRow[cleanKey] = row[key];
            });

            return newRow;
            });
            setExcelData(jsonData);

            calculateScore(jsonData);
        };

        reader.readAsArrayBuffer(file);
        };

    const calculateScore = (data) => {

        console.log("Excel Data:", data);

        let total = 0;

        data.forEach((row) => {
            if (row.Bobot) {
            total += Number(row.Bobot);
            }
        });

        let grade = "";

        if (total >= 80) grade = "Sangat Baik";
        else if (total >= 60) grade = "Baik";
        else if (total >= 40) grade = "Cukup";
        else grade = "Kurang";

        setScoreResult({
            total,
            grade
        });
        };


  return (
    <AdminLayout>
      <AdminHeader
       title="Evika"
        subtitle="Content Management System"
        showSearch={false}
        showDateFilter={false}
      />
      <div className="flex-1 overflow-y-auto p-6">
      <h2>EVIKA CMS</h2>
<br />
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        <Card className="mb-6">
        <CardHeader>
            <CardTitle>Upload Excel Penilaian</CardTitle>
        </CardHeader>

        <CardContent>

            <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelUpload}
            />

        </CardContent>
        </Card>

        {scoreResult && (
        <Card className="mb-6">
            <CardHeader>
            <CardTitle>Hasil Penilaian</CardTitle>
            </CardHeader>

            <CardContent>

            <p>Total Nilai : <b>{scoreResult.total}</b></p>
            <p>Kategori : <b>{scoreResult.grade}</b></p>

            </CardContent>
        </Card>
        )}

        {excelData.length > 0 && (
            <table className="data-table">
            <thead>
                <tr>
                {excelData.length > 0 &&
                Object.keys(excelData[0]).map((key) => (
                <th key={key}>{key}</th>
                ))}
                </tr>
            </thead>

            <tbody>
                {excelData.map((row, i) => (
                <tr key={i}>
                    {Object.values(row).map((val, j) => (
                    <td key={j}>{val}</td>
                    ))}
                </tr>
                ))}
            </tbody>
            </table>
            )}

</div>

      

    </div>
        </AdminLayout>
    
  );
}