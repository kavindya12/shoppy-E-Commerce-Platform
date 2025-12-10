import React, { useState, useEffect } from 'react';

const HeroCarousel = () => {
  const slides = [
    {
      title: 'New Season Drops!',
      subtitle: 'Final Reductions! Shop the latest looks before they sell out.',
      image: '/new-season-drops.jpg',
      button: {
        text: 'SHOP THE COLLECTION',
        link: '/products?sort=new-arrivals',
      },
    },
    {
      title: 'Flash Sale! Save Big!',
      subtitle: 'Prices drop for the next 3 hours only!',
      image: '/flash-sale.jpg',
      button: {
        text: 'GRAB THE DEAL NOW',
        link: '/products?sort=flash-sale',
      },
    },
    {
      title: 'Mega Winter Sale Clearance!',
      subtitle: 'Final Reductions! Up to 70% OFF sitwiwe.',
      image: '/winter-sale.jpg',
      button: {
        text: 'VIEW ALL SALE ITEMS',
        link: '/products?sort=winter-sale',
      },
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-64 md:h-96 overflow-hidden">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
            onError={e => { e.target.onerror = null; e.target.src = '/placeholder.jpg'; }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl md:text-6xl font-bold mb-2">{slide.title}</h2>
              <p className="text-xl md:text-2xl mb-4">{slide.subtitle}</p>
              {slide.button && (
                <a href={slide.button.link} className="inline-block bg-cyan-500 text-white font-bold px-6 py-3 rounded shadow hover:bg-cyan-600 transition">
                  {slide.button.text}
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2 h-2 rounded-full ${
              idx === currentSlide ? 'bg-white' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;

