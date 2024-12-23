/* eslint-disable react-hooks/exhaustive-deps */
import  { useEffect, useState } from 'react';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/images2.jpg';
import image3 from '../assets/image3.jpg';
import image4 from '../assets/image4.jpg';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6';

const BannerProduct = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const desktopImages = [image1, image2, image3, image4];

  const nextImage = () => {
    if (desktopImages.length - 1 > currentImage) {
      setCurrentImage((prev) => prev + 1);
    }
  };

  const prevImage = () => {
    if (currentImage !== 0) {
      setCurrentImage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (desktopImages.length - 1 > currentImage) {
        nextImage();
      } else {
        setCurrentImage(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImage]);

  return (
    <div className="container mx-auto px-4 rounded-lg m-6 overflow-hidden">
      <div className="h-96 md:h-[500px] w-full bg-gray-100 relative shadow-lg rounded-lg">
        {/* Navigation Buttons */}
        <div className="absolute z-10 h-full w-full md:flex items-center hidden">
        <div className="flex justify-between w-full px-4 text-3xl">
      <button
        onClick={prevImage}
        className="bg-blue-500 shadow-lg rounded-full p-3 hover:bg-blue-700 transition-all"
      >
        <FaAngleLeft />
      </button>
      <button
        onClick={nextImage}
        className="bg-blue-500 shadow-lg rounded-full p-3 hover:bg-blue-700 transition-all"
      >
        <FaAngleRight />
      </button>
    </div>
        </div>

        {/* Desktop and Tablet Version */}
        <div className="hidden md:flex h-full w-full overflow-hidden">
          {desktopImages.map((imageURL, index) => (
            <div
              className="w-full h-full min-w-full min-h-full transition-all"
              key={imageURL}
              style={{
                transform: `translateX(-${currentImage * 100}%)`,
              }}
            >
              <img
                src={imageURL}
                className="w-full h-full object-cover rounded-lg"
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Mobile Version */}
        <div className="flex h-full w-full overflow-hidden md:hidden">
          {desktopImages.map((imageURL, index) => (
            <div
              className="w-full h-full min-w-full min-h-full transition-all"
              key={imageURL}
              style={{
                transform: `translateX(-${currentImage * 100}%)`,
              }}
            >
              <img
                src={imageURL}
                className="w-full h-full object-cover rounded-lg"
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Caption */}
        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white py-4 px-6 text-center">
          <h2 className="text-xl md:text-2xl font-semibold">
            Discover Our Top Recommendations
          </h2>
          <p className="text-sm md:text-base">
            High-quality products tailored to your needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BannerProduct;
