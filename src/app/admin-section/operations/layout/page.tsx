"use client";
import React, { useState, useEffect } from "react";
import { createLayout } from "~/app/server-actions";
import { ClipLoader } from "react-spinners";
import AdminSeatMap from "~/app/components/AdminSeatMap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserContext } from "~/app/context";
const LayoutOperationsPage = () => {
  const [name, setName] = useState("");
  const [rows, setRows] = useState<number>(0);
  const [columns, setColumns] = useState<number>(0);
  const [warning, setWarning] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const context = useUserContext();
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setWarning("");
    setIsLoading(true);

    if (!name || !rows || !columns) {
      setWarning("Please fill all fields");
      setIsLoading(false);
      return;
    }

    try {
      const totalSeats = rows * columns;
      const seatMap = buildSeatMap(rows, columns);

      const newLayout = await createLayout({
        name,
        rows,
        columns,
        totalSeats,
        seatMap,
      });

      setMessage("Layout created successfully");
      console.log("New Layout:", newLayout);
    } catch (error) {
      setWarning("An error occurred while creating layout");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentAdminId = localStorage.getItem("adminId");
    if (!currentAdminId || currentAdminId === "")
      router.push("../../admin-section");
  }, []);
  const buildSeatMap = (rows: number, columns: number): string[][] => {
    const seatMap: string[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: string[] = [];
      for (let j = 0; j < columns; j++) {
        const seatNumber = String.fromCharCode(65 + i) + (j + 1);
        row.push(seatNumber);
      }
      seatMap.push(row);
    }
    return seatMap;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-6 text-white">
      <div className="w-full max-w-2xl rounded-lg bg-gray-800 p-8 shadow-xl">
        <h1 className="mb-8 text-center text-4xl font-semibold">
          Layout Operations
        </h1>

        <div className="rounded-lg bg-gray-700 p-6">
          <h3 className="mb-4 text-xl font-semibold">Create Layout</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className="mb-2 text-gray-300">Layout Name:</label>
              <input
                className="w-full rounded-md bg-gray-600 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-gray-300">Number of Rows:</label>
              <input
                className="w-full rounded-md bg-gray-600 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="number"
                value={rows}
                min={1}
                onChange={(e) => setRows(parseInt(e.target.value))}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-gray-300">Number of Columns:</label>
              <input
                className="w-full rounded-md bg-gray-600 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                type="number"
                value={columns}
                min={1}
                onChange={(e) => setColumns(parseInt(e.target.value))}
              />
            </div>

            <div className="mt-4 text-center text-gray-300">
              Total seats: <span className="font-bold">{rows * columns}</span>
            </div>

            {warning && (
              <div className="mt-2 text-center font-bold text-red-600">
                {warning}
              </div>
            )}
            {message && (
              <div className="mt-2 text-center font-bold text-green-600">
                {message}
              </div>
            )}

            <button
              className="mt-4 w-full rounded-md bg-blue-600 py-2 font-semibold text-white focus:outline-none"
              type="submit"
              disabled={isLoading}
            >
              {!isLoading ? "Submit" : <ClipLoader color="white" size={20} />}
            </button>
          </form>

          <div className="mt-6 flex space-x-4">
            <Link href="../operations/layout/layout-list">
              <button className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white focus:outline-none">
                Check Layout List
              </button>
            </Link>
            <Link href="../operations">
              <div className="w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white focus:outline-none">
                Back
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <AdminSeatMap rows={rows} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default LayoutOperationsPage;
