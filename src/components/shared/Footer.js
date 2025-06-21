import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center text-sm text-gray-500 p-4 border-t">
      &copy; {currentYear} <span className="text-[#3399ff]">Marine Forecast</span>. Data from
      Open-Meteo Marine API.
    </footer>
  );
};

export default Footer;
