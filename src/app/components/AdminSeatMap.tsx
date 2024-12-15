import React from "react";

const AdminSeatMap = ({ rows, columns }) => {
  return (
    <div>
      <div className="flex flex-col items-center text-white">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="mb-2 flex justify-center">
            {Array.from({ length: columns }, (_, seatIndex) => (
              <div
                key={seatIndex}
                className={`mr-2 flex h-10 w-10 items-center justify-center rounded-full border border-gray-300
                 
                `}
              >
                {/* Display seat character and number */}
                {String.fromCharCode(65 + rowIndex)}
                {seatIndex + 1}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSeatMap;
