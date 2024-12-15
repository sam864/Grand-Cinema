"use client";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import {
  getAllLayouts,
  deleteLayout,
  getSpecifiedLayout,
} from "~/app/server-actions";
import AdminSeatMap from "~/app/components/AdminSeatMap";
import { useUserContext } from "~/app/context";
import { useRouter } from "next/navigation";

const LayoutList = () => {
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading state
  const [loadingStates, setLoadingStates] = useState({});
  const [warnings, setWarnings] = useState({}); // State to track warnings for each layout
  const context = useUserContext();
  const router = useRouter();

  useEffect(() => {
    const currentAdminId = localStorage.getItem("adminId");
    if (!currentAdminId || currentAdminId === "")
      router.push("../../admin-section");
    async function fetchLayouts() {
      try {
        const allLayouts = await getAllLayouts();
        if (!allLayouts) {
          return;
        }
        const layoutObjArr = allLayouts.map((layout) => ({
          id: layout?.id,
          name: layout?.name,
          totalSeats: layout?.total_seats,
          rows: layout?.rows,
          columns: layout?.columns,
          roomArr: layout?.rooms,
        }));
        setLayouts(layoutObjArr);
        setLoading(false); // Set loading to false after layouts are fetched
      } catch (error) {
        console.error("Error fetching layouts:", error);
      }
    }
    fetchLayouts();
  }, []);

  const handleDeleteLayout = async (layoutId, index) => {
    try {
      setWarnings((prevWarnings) => ({
        ...prevWarnings,
        [layoutId]: "", // Reset warning for the layout
      }));
      setLoadingStates((prevStates) => ({
        ...prevStates,
        [layoutId]: true, // Set loading state to true for the current deletion
      }));
      const layout = await getSpecifiedLayout(layoutId);
      if (!layout) return;
      if (layout.rooms.length > 0) {
        setWarnings((prevWarnings) => ({
          ...prevWarnings,
          [layoutId]: "Cannot delete layout. Currently in use.", // Set warning for the layout
        }));
        return;
      }
      await deleteLayout(layoutId);
      setLayouts((prevLayouts) =>
        prevLayouts.filter((layout) => layout.id !== layoutId),
      );
    } catch (error) {
      console.error("Error deleting layout:", error);
    } finally {
      setLoadingStates((prevStates) => ({
        ...prevStates,
        [layoutId]: false, // Reset loading state after deletion is complete
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <ClipLoader color="#4F46E5" size={35} />
        </div>
      ) : (
        layouts.map((layout) => (
          <div
            key={layout.id}
            className="mb-4 rounded-md border border-gray-700 bg-gray-800 p-4"
          >
            <div className="text-lg font-bold">Name: {layout.name}</div>
            <div>Total seats: {layout.totalSeats}</div>
            <div>Rows: {layout.rows}</div>
            <div>Columns: {layout.columns}</div>
            <div className="mt-2">
              <AdminSeatMap rows={layout.rows} columns={layout.columns} />
            </div>
            {warnings[layout.id] && (
              <div className="font-bold text-red-500">
                {warnings[layout.id]}
              </div>
            )}
            <button
              onClick={() => handleDeleteLayout(layout.id)}
              disabled={loadingStates[layout.id]}
              className={`mt-2 rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 ${
                loadingStates[layout.id] ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {loadingStates[layout.id] ? (
                <ClipLoader color="white" size={20} />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        ))
      )}
      {layouts.length === 0 && !loading && (
        <div className="text-center text-2xl font-bold text-white">
          There are no layouts
        </div>
      )}
      <Link href="../layout">
        <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
          Back
        </button>
      </Link>
    </div>
  );
};

export default LayoutList;
