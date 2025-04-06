/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IoLogoInstagram } from "react-icons/io";
import { FaSquareXTwitter } from "react-icons/fa6";
import { BsLinkedin } from "react-icons/bs";
import img1 from "../../../public/developers/ikshit.jpeg";
import img2 from "../../../public/developers/tushar.jpeg";
import img3 from "../../../public/developers/dev.jpeg";
import img4 from "../../../public/developers/kshrin.jpeg";

// Custom card component to replace the UI library card
const CustomCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`bg-white rounded-xl shadow-xl ${className || ''}`}>
      {children}
    </div>
  );
};

// Custom card content component
const CustomCardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`p-4 ${className || ''}`}>
      {children}
    </div>
  );
};

const mentorDetails = [
  {
    name: "Ikshit Talera",
    image: img1,
    imageFallback: "IT",
    linkedin: "https://www.linkedin.com/in/ikshit04/",
    instagram: "https://leetcode.com/u/ikshit_04/",
    twitter: "https://x.com/Ikshit_04/",
  },
  {
    name: "Tushar Pamnani",
    image: img2,
    imageFallback: "TP",
    linkedin: "https://linkedin.com/in/tushar-pamnani",
    twitter: "https://x.com/Tushar_Pamnani_",
    instagram: "https://instagram.com/tusharpamnani7",
  },
  {
    name: "Dev Dua",
    image: img3,
    imageFallback: "DD",
    twitter: "https://x.com/Dev_dua_",
    instagram: "https://www.instagram.com/_dev_dua?igsh=enpxeHljaXExZTcy",
    linkedin: "https://www.linkedin.com/in/devansh-dua-dd18",
  },
  {
    name: "Kshrin Modi",
    image: img4,
    imageFallback: "KM",
    linkedin: "https://www.linkedin.com/in/kshirin-modi-747ab4269/",
    twitter: "https://x.com/kshirinmodi_22",
    instagram: "https://www.instagram.com/kshirin_007",
  }
];

const MentorsSlider = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [resetTimeout, setResetTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // Check if we're at the end of the scroll
  const checkIfAtEnd = () => {
    if (!scrollRef.current) return false;

    // Add a small buffer (1px) to account for potential rounding errors
    const isEnd =
      scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
      scrollRef.current.scrollWidth - 1;

    setIsAtEnd(isEnd);
    return isEnd;
  };

  useEffect(() => {
    if (!scrollRef.current || isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const atEnd = checkIfAtEnd();

        if (atEnd) {
          // Clear any existing timeout before setting a new one
          if (resetTimeout) clearTimeout(resetTimeout);

          // Set timeout to scroll back to the beginning
          const timeout = setTimeout(() => {
            if (!isPaused && scrollRef.current) {
              scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
            }
          }, 2000);

          setResetTimeout(timeout);
        } else {
          scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      if (resetTimeout) clearTimeout(resetTimeout);
    };
  }, [isPaused, resetTimeout]);

  // Add scroll event listener to check position while scrolling
  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (!scrollContainer) return;

    const handleScroll = () => {
      checkIfAtEnd();
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Custom Button component for navigation
  const NavButton = ({ direction, onClick }: { direction: 'left' | 'right', onClick: () => void }) => (
    <button
      className="absolute top-1/2 transform -translate-y-1/2 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 transition-colors duration-200"
      style={{ 
        left: direction === 'left' ? '-20px' : 'auto', 
        right: direction === 'right' ? '-20px' : 'auto',
        zIndex: 10
      }}
      onClick={onClick}
    >
      {direction === 'left' ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
    </button>
  );

  // Social media icon component
  const SocialIcon = ({ type, url }: { type: 'linkedin' | 'twitter' | 'instagram', url: string }) => {
    if (!url) return null;
    
    let icon;
    
    switch (type) {
      case 'linkedin':
        icon = <BsLinkedin size={24} className="text-blue-600" />;
        break;
      case 'twitter':
        icon = <FaSquareXTwitter size={24} className="text-gray-800" />;
        break;
      case 'instagram':
        icon = <IoLogoInstagram size={24} className="text-pink-600" />;
        break;
      default:
        return null;
    }
    
    return (
      <a
        className="cursor-pointer drop-shadow-xl scale-100 hover:scale-125 transition duration-500 ease-in-out"
        href={url}
        target="_blank"
        rel="noreferrer"
        aria-label={`${type} profile`}
      >
        {icon}
      </a>
    );
  };

  return (
    <div className="flex items-center flex-col gap-20 w-full">
      <h1 className="text-3xl font-bold lg:text-4xl text-center text-[#003C43]">
        Meet The Developers
      </h1>
      <div className="relative w-[80%] mx-auto">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth space-x-4 py-4"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          onMouseEnter={() => {
            setIsPaused(true);
            if (resetTimeout) clearTimeout(resetTimeout); // Prevent reset if hovered
          }}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Custom CSS for hiding scrollbar */}
          <style jsx global>{`
            .scroll-smooth::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {mentorDetails.map((mentor, index) => (
            <CustomCard
              key={index}
              className="min-w-[300px] hover:scale-105 transition-all snap-center flex flex-col items-center p-4 gap-4"
            >
              <div className="w-72 h-72 relative">
                <Image
                  className="rounded-md object-cover hover:scale-105 transition-all"
                  src={mentor.image}
                  alt={mentor.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <CustomCardContent className="text-center">
                <h4 className="text-xl font-semibold">{mentor.name}</h4>
                
                {/* Social Media Icons */}
                <div className="flex justify-center items-center gap-6 mt-6">
                  {mentor.linkedin && (
                    <SocialIcon type="linkedin" url={mentor.linkedin} />
                  )}
                  {mentor.twitter && (
                    <SocialIcon type="twitter" url={mentor.twitter} />
                  )}
                  {mentor.instagram && (
                    <SocialIcon type="instagram" url={mentor.instagram} />
                  )}
                </div>
              </CustomCardContent>
            </CustomCard>
          ))}
        </div>
        
        {/* Navigation buttons */}
        <NavButton 
          direction="left" 
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
            }
          }} 
        />
        <NavButton 
          direction="right" 
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
            }
          }} 
        />
      </div>
    </div>
  );
};

export default MentorsSlider;