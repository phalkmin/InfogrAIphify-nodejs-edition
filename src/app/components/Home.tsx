"use client";

import React, { useState, useEffect } from 'react';

interface CrawlResponse {
  content: string;
}

interface ChatResponse {
  summary: string;
}

interface InfoResponse {
  responseData: {
    response: string;
  }
}


const Home: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');



const funnyMessages = [
  "Shh, the infographic fairy is working her magic...",
  "Crunching numbers, brewing data, infographic incoming!",
  "Hold on tight, we're warping you to the infographic dimension!",
  "AI is busy analyzing the website, be patient grasshopper!",
  "Infographic in the making, please don't refresh (it tickles the AI).",
  "Shhh... I hear pixels being arranged. The infographic is coming!",
  "We're gathering website wisdom to craft your infographic masterpiece.",
  "Just a friendly reminder, the infographic might not be about cats...",
  "Hang tight! We're building your infographic, brick by data brick.",
];

useEffect(() => {
  const intervalId = setInterval(() => {
    setCurrentMessage(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
  }, 5000);

  return () => clearInterval(intervalId);
}, []);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    setCurrentMessage(randomMessage); // Set message before API call

  try {
    const crawlResponse = await fetch('/api/crawl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: inputValue }),
    });

    if (!crawlResponse.ok) {
      throw new Error('Failed to crawl URL');
    }

    const crawlData: CrawlResponse = await crawlResponse.json(); 
    const content = crawlData.content;

    const chatResponse = await fetch('/api/site', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: [content] }),
    });

    if (!chatResponse.ok) {
      throw new Error('Network response was not ok');
    }

    const chatData: ChatResponse = await chatResponse.json();


    const infograph = await fetch('/api/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( [chatData.summary] ),
    });

    if (!infograph.ok) {
      throw new Error('Network response was not ok');
    }

    const infodata: InfoResponse = await infograph.json();

    const finalgraph = await fetch('/api/graph', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( infodata.responseData.response ),
    });

    if (!infograph.ok) {
      throw new Error('Network response was not ok');
    }
    const graphdataBlob = await finalgraph.blob();
    const imageUrl = URL.createObjectURL(graphdataBlob);
    setImageUrl(imageUrl);     
  } catch (error) {
    console.error('Error:', error);
    setResponse(`Error occurred while fetching the URL. ${error}`);
  } finally {
    setLoading(false);
  }

};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <header className="flex flex-col justify-center items-center py-12 text-center">
        <h1 className="text-7xl font-bold text-white dark:text-gray-200">InfogrAIphify</h1>
        <p className="text-gray-300 dark:text-gray-400 mt-4">Enter an article URL and we will create an infographic for you.</p>
      </header>
      <main className="flex flex-col justify-between px-8">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-md self-center">
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Enter URL here"
            className="rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-fuchsia-600 py-3 text-white font-bold hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Create Infographic'}
          </button>
        </form>
        {loading && (
          <div className="mt-8 text-center text-gray-500 font-italic">
            {funnyMessages[Math.floor(Math.random() * funnyMessages.length)]}
          </div>
        )}
        {imageUrl && (
          <div className="mt-8 mx-auto w-full max-w-2xl">
            <img src={imageUrl} alt="Infographic" className="rounded-lg shadow-md" />
          </div>
        )}
        {response && (
          <div className="mt-4 text-center text-red-500">{response}</div>
        )}
      </main>
    </div>
  );
};

export default Home;

