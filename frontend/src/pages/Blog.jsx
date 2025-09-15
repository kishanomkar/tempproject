import React from 'react';

// A mock array of news articles to demonstrate the component
const newsArticles = [
  {
    headline: 'The Future of AI in Healthcare: Innovations and Ethical Concerns The Future of AI in Healthcare: Innovations and Ethical ConcernsThe Future of AI in Healthcare: Innovations and Ethical Concerns',
  },
  {
    headline: 'Markets React to Latest Inflation Data: What Investors Need to Know',
  },
  {
    headline: 'Discovering New Species in the Amazon Rainforest: A Scientific Breakthrough',
  },
  {
    headline: 'Top 10 Global Food Trends for 2024: From Plant-Based to Fusion',
  },
  {
    headline: 'NASA Announces New Mission to Explore Jupiter’s Icy Moon Europa',
  },
  {
    headline: 'The Resurgence of Classical Art: Modern Interpretations and Exhibitions',
  },
  {
    headline: 'The Resurgence of Classical Art: Modern Interpretations and Exhibitions',
  },
    {
    headline: 'The Resurgence of Classical Art: Modern Interpretations and Exhibitions',
  },
    {
    headline: 'The Resurgence of Classical Art: Modern Interpretations and Exhibitions',
  },
];

// Main News Section Component
const Blog = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Safety Updates</h1>
      <div className="space-y-4">
        {newsArticles.map((article, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
          >
            {/* The main card content, using flexbox for horizontal layout */}
            <div className={`p-4 flex items-center `}>
              {/* Left side: Text content */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 leading-tight mb-2">
                  {article.headline}
                </h2>

              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;