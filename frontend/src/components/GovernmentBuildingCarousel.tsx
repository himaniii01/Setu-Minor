import React, { useState, useEffect } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

export const GovernmentBuildingCarousel: React.FC = () => {
  const slides = [
    {
      title: 'Parliament House & Secretariat',
      location: 'New Delhi',
      img: '/india_gov_building.jpg',
      tag: 'Central Government'
    },
    {
      title: 'Rashtrapati Bhavan Presidential Palace',
      location: 'New Delhi',
      img: '/rashtrapati_bhavan.jpg',
      tag: 'Official Residence'
    },
    {
      title: 'North Block & South Block Secretariat',
      location: 'New Delhi',
      img: '/central_secretariat.jpg',
      tag: 'Union Ministries'
    },
    {
      title: 'Vidhana Soudha Capitol Complex',
      location: 'State Capitol',
      img: '/vidhana_soudha.jpg',
      tag: 'State Legislature'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  const current = slides[currentIndex];

  return (
    <div className="relative w-full h-full min-h-[340px] sm:min-h-[400px] overflow-hidden flex items-center justify-center p-0 group rounded-2xl shadow-soft">
      {/* Full-bleed Edge-to-Edge Image */}
      <img
        key={`slide-${current.img}`}
        src={current.img}
        alt={current.title}
        className="w-full h-full object-cover object-center transition-all duration-700 animate-fadeIn scale-100 group-hover:scale-105 absolute inset-0"
      />

      {/* Dark Gradient Overlay for legible captions */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#08234D]/90 via-slate-950/25 to-black/10 pointer-events-none z-10" />

      {/* Manual Arrow Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors z-20 opacity-0 group-hover:opacity-100"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors z-20 opacity-0 group-hover:opacity-100"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Caption & Controls */}
      <div className="absolute bottom-5 left-5 right-5 z-10 text-white flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
        <div>
          <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
            {current.tag} • {current.location}
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold mt-1 text-white shadow-sm drop-shadow-md">
            {current.title}
          </h3>
        </div>

        {/* Dots Indicator */}
        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentIndex === idx ? 'bg-amber-400 w-5' : 'bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
