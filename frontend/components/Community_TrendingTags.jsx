import React, { useState, useEffect } from "react";
import { TrendingUp, Hash } from "lucide-react";
import useConfigStore from "../stores/configStore";

const Community_TrendingTags = ({ onTagClick, selectedTags }) => {
  const [trendingTags, setTrendingTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const { backendUrl } = useConfigStore();

  useEffect(() => {
    fetchTrendingTags();
  }, []);

  const fetchTrendingTags = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/v1/posts/trending-tags`);
      const data = await response.json();

      if (data.success) {
        setTrendingTags(data.tags);
      }
    } catch (error) {
      console.error("Failed to fetch trending tags:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="text-purple-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-900">Trending Tags</h3>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-8 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      ) : trendingTags.length === 0 ? (
        <p className="text-gray-600 text-sm">No trending tags yet</p>
      ) : (
        <div className="space-y-2">
          {trendingTags.map((tag, index) => (
            <button
              key={tag.name}
              onClick={() => onTagClick(tag.name)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                selectedTags.includes(tag.name)
                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Hash size={14} className="text-gray-400" />
                <span className="font-medium">{tag.name}</span>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {tag.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Popular Categories */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Popular Categories
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            "education",
            "healthcare",
            "agriculture",
            "employment",
            "housing",
            "welfare",
          ].map((category) => (
            <button
              key={category}
              onClick={() => onTagClick(category)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedTags.includes(category)
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community_TrendingTags;
