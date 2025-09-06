import React from "react";
import Home_ShowOff from "../components/Home_ShowOff";
import Home_Whatyouwanttodo from "../components/Home_Whatyouwanttodo";
import useAuthStore from "../stores/authStore";

const HomePage = () => {
  const { user } = useAuthStore();
  return (
    <div className="w-full h-full flex items-center justify-center ">
      <div className="w-full h-full flex flex-col items-start justify-start ">
        <div className="bg-primary w-full rounded-b-3xl h-auto flex items-start text-text border-b-4 border-text dark:bg-transparent dark:text-indigo-400  clash-dispay p-6 flex-col text-left justify-start ">
          <p className="text-2xl font-semibold">Welcome {user.name}! </p>
          <p className="dark:text-gray-300 text-gray-700">
            Your gateway to government benefits and schemes
          </p>
        </div>
        {/* Show off section */}
        <Home_ShowOff />
        {/* App Navigator  */}
        <Home_Whatyouwanttodo />
      </div>
    </div>
  );
};

export default HomePage;
