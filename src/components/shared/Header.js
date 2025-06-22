'use client';
import React, { useState, useEffect } from 'react';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dateTime, setDateTime] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const updateDateTime = () => {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, '0');
      const month = now.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      const year = now.getFullYear();
      let hour = now.getHours();
      const minute = now.getMinutes().toString().padStart(2, '0');
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12 || 12;

      const formatted = `${day} ${month} ${year}, ${hour}:${minute} ${ampm}`;
      setDateTime(formatted);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, [mounted]);

  return (
    <header
      className={`fixed top-0 z-30 w-full transition-all duration-300 shadow 
        ${isScrolled ? 'bg-blue-50 text-gray-700 bg-opacity-60 backdrop-blur-md' : 'bg-[#3399ff] text-white'}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between px-4 sm:px-6 lg:px-8 py-4 space-y-2 md:space-y-0">
        <div className="flex items-center space-x-3">
          <img src="favicon.ico" alt="Logo" className="h-10 w-10" />
          <h1 className="text-2xl md:text-3xl font-bold">Marine Forecast</h1>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <p className="text-base md:text-lg">Accurate ocean weather at your fingertips</p>
          {mounted && <span className="text-sm md:text-base">{dateTime}</span>}
        </div>
      </div>
    </header>
  );
}

export default Header;
