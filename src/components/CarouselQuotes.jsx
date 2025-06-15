import React from "react";
import Slider from "react-slick";

const slides = [
  {
    headline: "stop guessing and start winning",
    body: "Submit your promotional marketing concept. See what happens when strategy meets creativity.",
  },
  {
    headline: "strategic clarity, not waffle",
    body: "Trudy delivers clear, behavioural feedback grounded in decades of promo marketing experience.",
  },
  {
    headline: "built for real marketers",
    body: "No fluff. Just insight, ideas, and brand-building smarts. It’s like a strategist in your pocket.",
  },
];

export default function CarouselQuotes() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,
  };

  return (
    <Slider {...settings}>
      {slides.map((slide, i) => (
        <div key={i} className="px-10 py-16 text-white bg-[#16355c] h-full flex items-center justify-center">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-bold text-orange-400 mb-4">
              {slide.headline}
            </h2>
            <p className="text-base">{slide.body}</p>
          </div>
        </div>
      ))}
    </Slider>
  );
}
