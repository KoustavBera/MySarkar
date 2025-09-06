import React from "react";

const stats = [
  { value: "500+", label: "Available Schemes" },
  { value: "95%", label: "Success Rate" },
];

const Home_ShowOff = () => (
  <div className=" w-full flex px-3 md:px-5 py-6 gap-1 md:gap-5 md:flex-row flex-col md:items-start items-center justify-items-start">
    {stats.map(({ value, label }) => (
      <div
        key={label}
        className="w-full md:w-1/2 rounded-2xl border-1 border-purple-500 dark:border-text h-20
                   flex flex-col items-center justify-center text-center"
      >
        <p className="text-text dark:text-white font-semibold text-xl">
          {value}
        </p>
        <p className="text-gray-600 dark:text-white/70 text-sm">{label}</p>
      </div>
    ))}
  </div>
);

export default Home_ShowOff;
