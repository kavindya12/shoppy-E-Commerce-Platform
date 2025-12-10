import React, { useState, useEffect } from 'react';

const FlashSaleTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 30,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          clearInterval(timer);
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-red-500 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center space-x-4">
        <span className="font-bold text-lg">⚡ Flash Sale Ends In:</span>
        <div className="flex space-x-2">
          <div className="bg-white text-red-500 px-3 py-1 rounded font-bold">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <span>:</span>
          <div className="bg-white text-red-500 px-3 py-1 rounded font-bold">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <span>:</span>
          <div className="bg-white text-red-500 px-3 py-1 rounded font-bold">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleTimer;

