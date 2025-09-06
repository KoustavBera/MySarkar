import {
  ArrowRightIcon,
  Mail,
  MapPin,
  MapPinIcon,
  Phone,
  Quote,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
export const Landing = () => {
  const features = [
    {
      title: "Easy Access",
      desc: "Access all government schemes in one place",
      img: "/scheme.png",
    },
    {
      title: "Quick Application",
      desc: "Apply for schemes with minimal paperwork",
      img: "/assistant.png",
    },
    {
      title: "Track Status",
      desc: "Real-time updates on your applications",
      img: "/docDigitizer.png",
    },
  ];
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };
  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4">
      <div className="fixed inset-0 -z-10 w-full h-full bg-secondary [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] bg-fixed"></div>

      <div className="text-center max-w-4xl flex flex-col items-center  mx-auto">
        <div className="h-[10rem]"></div>
        <div className="bg-white rounded-full  px-[1.5%] py-[0.5%] self-center border-1 border-b-2 text-[13px] border-r-2 border-purple-700  my-9 ">
          <span className="text-black/60  font-semibold">
            Easing accessibility ⚡
          </span>{" "}
          <span className=" font-bold text-text">since 2025</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-purple-800 text-shadow-purple-500 text-shadow-xl mb-6 stroke-1 stroke-black">
          Welcome to MySarkar
        </h1>
        <p className=" text-gray-600 mb-8 text-md">
          Effortlessly navigate government documents with AI-powered,
          step-by-step guidance—scan, understand, with MultiLingual
          capabilities, with voice and chat support for clear, accessible help
          every time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="bg-purple-100 border-1 border-r-4 border-b-4 border-purple-800  flex gap-x-1 hover:bg-purple-700 text-text hover:text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
          >
            <p>Get started</p>
            <p>
              <ArrowRightIcon />{" "}
            </p>
          </Link>
        </div>
        <div className="md:mt-[15rem] mt-[5rem]  flex items-center gap-[5%] justify-center w-full">
          <div className="left  md:w-full border-2 rounded-2xl w-[12rem] pb-3 translate-y-[25%] p-1  md:p-10 border-b-4 border-r-4 border-text bg-amber-100">
            <h1 className="md:text-[3rem] text-2xl   font-bold">
              <Quote
                absoluteStrokeWidth
                className="rotate-180"
                strokeWidth={4}
                size={48}
              />
              <span>Scheme Feature</span>
            </h1>
            <p className="mt-3 text-gray-600 text-xs md:text-sm ">
              Find all government schemes in one place with MySarkar—your simple
              gateway to discovering central and state welfare programs. Scan
              documents, check eligibility, and get clear step-by-step guidance
              in Hindi, Bengali, or English to easily apply for the schemes you
              need.
            </p>
          </div>
          <div className="right w-[50%] ">
            <img src="/scheme.png" alt="" />
          </div>
        </div>
        <div className="mt-12">
          <div className="md:mt-[5rem] mt-[5rem]  flex items-center gap-[5%] justify-center w-full">
            <div className="right w-[50%] ">
              <img src="/docDigitizer.png" alt="" />
            </div>
            <div className="left  md:w-full border-2 rounded-2xl w-[12rem] pb-3 translate-y-[25%] p-1  md:p-10 border-b-4 border-r-4 border-text bg-green-100">
              <h1 className="md:text-[3rem] text-2xl   font-bold">
                <Quote
                  absoluteStrokeWidth
                  className="rotate-180"
                  strokeWidth={4}
                  size={48}
                />
                <span>Doc Digitizer</span>
              </h1>
              <p className="mt-3 text-gray-600 text-xs md:text-sm ">
                Doc Digitizer automatically scans, organizes, and stores your
                government documents securely—making it effortless to find,
                manage, and access them anytime, without the clutter of physical
                paperwork.
              </p>
            </div>
          </div>
          <div className="md:mt-[5rem] mt-[5rem]  flex items-center gap-[5%] justify-center w-full">
            <div className="left  md:w-full border-2 rounded-2xl w-[12rem] pb-3 translate-y-[25%] p-1  md:p-10 border-b-4 border-r-4 border-text bg-amber-100">
              <h1 className="md:text-[3rem] text-2xl   font-bold">
                <Quote
                  absoluteStrokeWidth
                  className="rotate-180"
                  strokeWidth={4}
                  size={48}
                />
                <span>RAG assistant</span>
              </h1>
              <p className="mt-3 text-gray-600 text-xs md:text-sm ">
                Our AI-powered multilingual assistant uses advanced
                Retrieval-Augmented Generation to answer queries in Hindi,
                Bengali, or English. It keeps chat context, understands your
                documents, and guides you step-by-step with both voice and text.
              </p>
            </div>
            <div className="right w-[50%] ">
              <img src="/assistant.png" alt="" />
            </div>
          </div>
          <div className="mt-12"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {[
              {
                title: "Easy Access",
                desc: "Access all government schemes in one place",
              },
              {
                title: "Quick Application",
                desc: "Apply for schemes with minimal paperwork",
              },
              {
                title: "Track Status",
                desc: "Real-time updates on your applications",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-purple-700 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="md:mt-[10rem] mt-[8rem] w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                question: "How do I get started with MySarkar?",
                answer:
                  "Simply click 'Get Started', create your account, and upload your documents. Our AI assistant will guide you through the rest!",
                bgColor: "bg-blue-100",
              },
              {
                question: "Is my personal information secure?",
                answer:
                  "Yes, we use bank-level security with 256-bit encryption and comply with all government data protection standards.",
                bgColor: "bg-green-100",
              },
              {
                question: "Which languages are supported?",
                answer:
                  "MySarkar supports Hindi, Bengali, and English for both text and voice interactions.",
                bgColor: "bg-yellow-100",
              },
              {
                question: "Do I need to pay?",
                answer: "Our app is completely free, accessible to everyone",
                bgColor: "bg-purple-100",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className={`${faq.bgColor} border-2 border-b-4 border-r-4 border-text rounded-2xl p-6`}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Contact Section */}
        <div className="md:mt-[10rem] mt-[8rem] w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-12">
            Get in Touch
          </h2>
          <div className="bg-white border-2 border-b-4 border-r-4 border-purple-800 rounded-2xl p-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-purple-100 border-2 border-b-4 border-r-4 border-purple-800 rounded-full p-4 mb-4">
                  <Phone className="text-purple-700" size={32} />
                </div>
                <h3 className="font-bold text-purple-800 mb-2">Call Us</h3>
                <p className="text-gray-600">1800-123-4567</p>
                <p className="text-gray-500 text-sm">Mon-Fri, 9 AM - 6 PM</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-purple-100 border-2 border-b-4 border-r-4 border-purple-800 rounded-full p-4 mb-4">
                  <Mail className="text-purple-700" size={32} />
                </div>
                <h3 className="font-bold text-purple-800 mb-2">Email Us</h3>
                <p className="text-gray-600">support@mysarkar.gov.in</p>
                <p className="text-gray-500 text-sm">
                  Response within 24 hours
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-purple-100 border-2 border-b-4 border-r-4 border-purple-800 rounded-full p-4 mb-4">
                  <MapPinIcon className="text-purple-700" size={32} />
                </div>
                <h3 className="font-bold text-purple-800 mb-2">Visit Us</h3>
                <p className="text-gray-600">Kolkata, West Bengal</p>
                <p className="text-gray-500 text-sm">
                  Service Centers Available
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="md:mt-[10rem] mt-[8rem] mb-[5rem] w-full">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 border-2 border-b-4 border-r-4 border-purple-800 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Simplify Your Government Experience?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who have already streamlined their
              government interactions with MySarkar.
            </p>
            <Link
              to="/login"
              className="bg-white text-purple-700 hover:bg-gray-100 font-bold py-4 px-12 rounded-lg border-2 border-b-4 border-r-4 border-purple-800 transition duration-200 inline-flex items-center gap-2"
            >
              Start Your Journey
              <ArrowRightIcon size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
