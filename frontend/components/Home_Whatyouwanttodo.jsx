import React from "react";
import { CameraIcon, File, PhoneCall, SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Home_Whatyouwanttodo = () => {
  const navigator = [
    {
      icon: SearchIcon,
      heading: "Find Schemes",
      link: "/scheme",
      desc: "Get personalised government scheme recommendations",
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-700",
    },
    {
      icon: CameraIcon,
      heading: "Scan Documents",
      link: "/scan",
      desc: "Digitize and analyze form with AI assistance",
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-700",
    },
    {
      icon: File,
      heading: "Application Help",
      link: "/apply",
      desc: "Step-by-step guidance for scheme applications",
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-700",
    },
    {
      icon: PhoneCall,
      heading: "Get Call",
      link: "/call",
      desc: "get AI assisted calling",
      bg: "bg-cyan-50",
      text: "text-cyan-700",
      border: "border-cyan-700",
    },
  ];

  return (
    <div className="w-full mt-[5%] flex items-center justify-center flex-col gap-4">
      <h1 className="text-2xl md:text-4xl text-text dark:text-white/80  md:mb-3 font-semibold">
        What do you want to do?
      </h1>

      <div className="md:grid md:grid-cols-4  flex flex-col  gap-4 px-4">
        {navigator.map((item, idx) => (
          <Link
            to={item.link}
            key={idx}
            className={`w-auto h-40 hover:scale-105 duration-75 transition-all ease-in p-4 border border-b-2 border-r-2 ${item.border} rounded-2xl flex flex-col items-center justify-center gap-2 ${item.bg} dark:bg-transparent cursor-pointer`}
          >
            <item.icon strokeWidth={1} className={`w-10 h-10  ${item.text}`} />
            <h2 className={`text-center font-bold text-text dark:text-white`}>
              {item.heading}
            </h2>
            <p className="dark:text-white/70">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home_Whatyouwanttodo;
