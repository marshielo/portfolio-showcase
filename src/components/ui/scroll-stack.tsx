"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export interface ScrollStackCard {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  backgroundImage?: string;
}

interface ScrollStackProps {
  cards: ScrollStackCard[];
  backgroundColor?: string;
  cardHeight?: string;
  animationDuration?: string;
  sectionHeightMultiplier?: number;
  intersectionThreshold?: number;
  className?: string;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  cards,
  backgroundColor = "bg-background",
  cardHeight = "60vh",
  animationDuration = "0.5s",
  sectionHeightMultiplier = 3,
  intersectionThreshold = 0.1,
  className = "",
}) => {
  const router = useRouter();
  const scrollableSectionRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [hasCompletedScroll, setHasCompletedScroll] = useState(false);
  const scrollPositionRef = useRef(0);
  const ticking = useRef(false);
  const cardCount = Math.min(cards.length, 5);

  const cardStyle = {
    height: cardHeight,
    maxHeight: "500px",
    borderRadius: "20px",
    transition: `transform ${animationDuration} cubic-bezier(0.19, 1, 0.22, 1), opacity ${animationDuration} cubic-bezier(0.19, 1, 0.22, 1)`,
    willChange: "transform, opacity" as const,
  };

  useEffect(() => {
    const preventScroll = (e: WheelEvent | TouchEvent) => {
      if (isScrollLocked) e.preventDefault();
    };

    if (isScrollLocked) {
      window.addEventListener("wheel", preventScroll, { passive: false });
      window.addEventListener("touchmove", preventScroll, { passive: false });
      scrollPositionRef.current = window.pageYOffset;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollPositionRef.current);
    }

    return () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isScrollLocked]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!sectionRef.current || !scrollableSectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const isInView =
        rect.top <= 100 && rect.bottom >= window.innerHeight * 0.5;

      if (isInView && !hasCompletedScroll) {
        const scrollContainer = scrollableSectionRef.current;
        const maxScroll =
          scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const currentScroll = scrollContainer.scrollTop;

        if (e.deltaY > 0) {
          e.preventDefault();
          setIsScrollLocked(true);
          scrollContainer.scrollTop += e.deltaY;
          if (scrollContainer.scrollTop >= maxScroll - 5) {
            setHasCompletedScroll(true);
            setIsScrollLocked(false);
          }
        } else if (e.deltaY < 0) {
          if (currentScroll <= 5) {
            setIsScrollLocked(false);
            return;
          }
          e.preventDefault();
          setIsScrollLocked(true);
          scrollContainer.scrollTop += e.deltaY;
        }
      } else if (isInView && hasCompletedScroll && e.deltaY < 0) {
        const scrollContainer = scrollableSectionRef.current;
        const maxScroll =
          scrollContainer.scrollHeight - scrollContainer.clientHeight;
        if (scrollContainer.scrollTop >= maxScroll - 10) {
          e.preventDefault();
          setIsScrollLocked(true);
          setHasCompletedScroll(false);
          scrollContainer.scrollTop += e.deltaY;
        }
      }
    };

    if (isIntersecting) {
      window.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isIntersecting, hasCompletedScroll]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
        if (!entry.isIntersecting) {
          if (entry.boundingClientRect.top > 0) {
            setHasCompletedScroll(false);
            setIsScrollLocked(false);
            if (scrollableSectionRef.current)
              scrollableSectionRef.current.scrollTop = 0;
          } else if (entry.boundingClientRect.bottom < 0) {
            setIsScrollLocked(false);
          }
        }
      },
      { threshold: intersectionThreshold }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [intersectionThreshold]);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          if (!sectionRef.current || !cardsContainerRef.current) return;
          const scrollContainer = scrollableSectionRef.current;
          if (!scrollContainer) return;

          const scrollTop = scrollContainer.scrollTop;
          const maxScroll =
            scrollContainer.scrollHeight - scrollContainer.clientHeight;
          const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

          let newActiveIndex = 0;
          const progressPerCard = 1 / cardCount;
          for (let i = 0; i < cardCount; i++) {
            if (progress >= progressPerCard * (i + 1)) newActiveIndex = i + 1;
          }
          setActiveCardIndex(Math.min(newActiveIndex, cardCount - 1));
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    const scrollElement = scrollableSectionRef.current;
    scrollElement?.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => scrollElement?.removeEventListener("scroll", handleScroll);
  }, [cardCount]);

  const getCardTransform = (index: number) => {
    const isVisible = isIntersecting && activeCardIndex >= index;
    const scale = 0.9 + index * 0.05;
    let translateY = "100px";
    if (isVisible) translateY = `${90 - index * 30}px`;

    return {
      transform: `translateY(${translateY}) scale(${scale})`,
      opacity: isVisible ? (index === 0 ? 0.9 : 1) : 0,
      zIndex: 10 + index * 10,
      pointerEvents: isVisible ? ("auto" as const) : ("none" as const),
    };
  };

  return (
    <section
      ref={scrollableSectionRef}
      className="relative w-full h-screen overflow-y-scroll"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style jsx>{`
        section::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div
        ref={sectionRef}
        className={`relative ${className}`}
        style={{ height: `${sectionHeightMultiplier * 100}vh` }}
      >
        <div
          className={`sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden ${backgroundColor}`}
        >
          <div className="container px-6 lg:px-8 mx-auto h-full flex flex-col justify-center">
            <div
              ref={cardsContainerRef}
              className="relative w-full max-w-5xl mx-auto flex-shrink-0"
              style={{ height: cardHeight }}
            >
              {cards.slice(0, 5).map((card, index) => {
                const cardTransform = getCardTransform(index);

                return (
                  <div
                    key={card.id}
                    className="absolute z-50 overflow-hidden shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => router.push(`/portfolio/${card.id}`)}
                    style={{
                      ...cardStyle,
                      top: 0,
                      left: "50%",
                      transform: `translateX(-50%) ${cardTransform.transform}`,
                      width: "100%",
                      maxWidth: "100%",
                      opacity: cardTransform.opacity,
                      zIndex: cardTransform.zIndex,
                      pointerEvents: cardTransform.pointerEvents,
                    }}
                  >
                    <div
                      className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 to-black/80"
                      style={{
                        backgroundImage: card.backgroundImage
                          ? `url('${card.backgroundImage}')`
                          : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundBlendMode: "overlay",
                        backgroundColor: card.backgroundImage
                          ? undefined
                          : "#374151",
                      }}
                    />

                    {card.badge && (
                      <div className="absolute top-4 right-4 z-20">
                        <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white">
                          <span className="text-sm font-medium">
                            {card.badge}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="relative z-10 p-5 sm:p-6 md:p-8 h-full flex items-end">
                      <div className="max-w-lg">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-2">
                          {card.title}
                        </h3>
                        {card.subtitle && (
                          <p className="text-lg text-white/80">
                            {card.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollStack;
