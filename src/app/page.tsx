"use client"
import GitSmartHero from "../components/Home/Hero";
import FeaturesSection from "../components/Home/Features";
import MentorsSlider from "../components/Home/MentorsSlide";

export default function Home() {

  return (
    <div className="overflow-hidden">
      <GitSmartHero/>
      <FeaturesSection/>
      <MentorsSlider/>
    </div>
  );
}
