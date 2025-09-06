import React, { useState } from "react";
import axios from "axios";
import { ArrowLeft, MessageSquare } from "lucide-react";
const SchemeRecommender = () => {
  const [query, setquery] = useState("");
  const [recommendedschemes, setrecommendedschemes] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://127.0.0.1:8000/recommend", {
      query: query,
    });
    console.log(res.data.recommendations);
    setrecommendedschemes(res.data.recommendations);
  };
  const [selectedScheme, setSelectedScheme] = useState(null);
  // DETAIL VIEW
  if (selectedScheme)
    return (
      <div className="w-full min-h-screen bg-secondary dark:bg-zinc-900  overflow-x-hidden">
        <div className="max-w-4xl mx-auto p-4">
          <button
            onClick={() => setSelectedScheme(null)}
            className="flex items-center gap-2 text-text mb-4"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div className="bg-white border border-purple-700 border-r-4 border-b-4 dark:bg-zinc-900 rounded-lg p-6 space-y-6">
            <h1 className="text-2xl font-bold">{selectedScheme.title}</h1>
            <p className="text-xl text-gray-600">
              {selectedScheme.ministry || selectedScheme.state}
            </p>

            <section>
              <h2 className="text-xl font-semibold text-text mb-2">Details</h2>
              {selectedScheme.details.description.split("\n\n").map((p, i) => (
                <p key={i} className="mb-2 text-lg break-words">
                  {p}
                </p>
              ))}
            </section>

            <section>
              <h2 className="md:text-lg text-base font-semibold text-text mb-2 ">
                Benefits
              </h2>
              <ul className="list-disc pl-5 text-lg">
                {selectedScheme.details.benefits.tangible.map((b, i) => (
                  <li key={i} className="break-words">
                    {b}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="md:text-lg text-base font-semibold text-text mb-2 ">
                Eligibility
              </h2>
              <ol className="list-decimal pl-5 text-lg">
                {selectedScheme.details.eligibility.map((e, i) => (
                  <li key={i} className="break-words">
                    {e}
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="md:text-lg text-base font-semibold text-text mb-2 ">
                Documents
              </h2>
              <ol className="list-decimal pl-5 text-lg">
                {selectedScheme.details.documents.map((d, i) => (
                  <li key={i} className="break-words">
                    {d}
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </div>
    );

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div>
        <h1 className="md:text-5xl text-3xl font-semibold text-text">
          Scheme Recommender
        </h1>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="w-full p-1.5 my-3.5 border-text border-1 md:text-sm text-sm rounded-3xl border-b-3 outline-0 "
              placeholder="Write the type of scheme you are looking at?"
              onChange={(e) => setquery(e.target.value)}
              value={query}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg border-text border-b-2 border-r-2 border-1"
            >
              Search
            </button>
          </form>
        </div>

        <div>
          {recommendedschemes &&
            recommendedschemes.map((s, index) => (
              <div
                key={s.id}
                className="bg-white border-b-4 border-r-4 border-purple-600 rounded-md p-4 shadow-sm cursor-pointer hover:shadow"
                onClick={() => setSelectedScheme(s.scheme)} // select only the scheme object
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-text md:text-2xl ">
                    {s.scheme.title}
                  </h3>
                  <MessageSquare className="w-5 h-5 text-purple-700" />
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  {s.scheme.ministry || s.scheme.state}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  {s.scheme.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {s.scheme.tags?.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SchemeRecommender;
