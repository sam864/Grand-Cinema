"use client";
import React, { useState, useEffect } from "react";
import { createCinema } from "~/app/server-actions";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import { useUserContext } from "~/app/context";
import { useRouter } from "next/navigation";
const CinemaOperationsPage = () => {
  const [name, setName] = useState("");
  const [numberOfRooms, setNumberOfRooms] = useState<number | undefined>(
    undefined,
  );
  const context = useUserContext();
  const router = useRouter();
  const [warning, setWarning] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateCinema = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setWarning("");
    setIsLoading(true);

    try {
      if (!name || numberOfRooms === undefined || numberOfRooms <= 0) {
        setWarning("Please fill all fields with valid values.");
        setIsLoading(false);
        return;
      }

      const newCinema = await createCinema({ name, numberOfRooms });

      setMessage("Cinema created successfully");
      console.log("New cinema:", newCinema.data);
    } catch (error) {
      console.error("Error:", error);
      setWarning("An error occurred while creating cinema.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const currentAdminId = localStorage.getItem("adminId");
    if (!currentAdminId || currentAdminId === "")
      router.push("../../admin-section");
  }, []);
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Cinema operations</h1>
      <div className="rounded-lg bg-gray-100 p-4">
        <h3 className="mb-2 text-lg font-semibold">Create Cinema</h3>
        <form className="space-y-2" onSubmit={handleCreateCinema}>
          <div>
            <label className="mb-1 block">Cinema Name:</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block">Number of Rooms:</label>
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              type="number"
              min={0}
              value={numberOfRooms || ""}
              onChange={(e) => setNumberOfRooms(parseInt(e.target.value))}
            />
          </div>
          {warning && <div className="font-bold text-red-600">{warning}</div>}
          {message && <div className="font-bold text-green-600">{message}</div>}
          <button
            className="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            type="submit"
            disabled={isLoading}
          >
            {!isLoading ? "Submit" : <ClipLoader color="white" size={20} />}
          </button>
        </form>
        <button className="mt-2 rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600">
          <Link href="../operations/cinema/cinema-list">Check cinema list</Link>
        </button>
        <Link href="../operations">
          <div className="focus:shadow-outline-blue mt-2 flex w-14 justify-center rounded bg-blue-500 p-2 text-center  text-white hover:bg-blue-600 focus:outline-none">
            Back
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CinemaOperationsPage;
