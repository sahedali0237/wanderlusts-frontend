"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Testimonial = {
  quote: string;
  name: string;
  location: string;
  image: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Planned. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable.",
    name: "Michael Chen",
    location: "Singapore",
    image: "/assets/person2.png",
  },
  {
    quote:
      "Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommend!",
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "/assets/person1.png",
  },
  {
    quote:
      "Every Moment In Kyoto Felt Like Stepping Into A Storybook. The Local Guides Shared Secrets No Guidebook Could Ever Offer.",
    name: "Daniel Whitmore",
    location: "London, UK",
    image: "/assets/person3.jpg",
  },
  {
    quote:
      "Our Safari Was Flawless From Start To Finish. The Team Handled Every Detail, So All We Had To Do Was Marvel At It All.",
    name: "Priya Sharma",
    location: "Mumbai, India",
    image: "/assets/person6.jpg",
  },
  {
    quote:
      "Our Santorini Escape Was Pure Bliss. Sunset Views, Beautiful Villas, And A Team That Anticipated Everything We Needed.",
    name: "Amara Bennett",
    location: "Cape Town, South Africa",
    image: "/assets/person4.jpg",
  },
  {
    quote:
      "Iceland's Northern Lights Left Us Speechless. The Itinerary Balanced Adventure And Comfort Perfectly For Our Family.",
    name: "James Carter",
    location: "Toronto, Canada",
    image: "/assets/person5.jpg",
  },
];

export default function Testimonials() {
  const [autoplay] = React.useState(() =>
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );
  const [plugins] = React.useState([autoplay]);

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="w-full bg-white px-4 py-16 sm:px-8 lg:px-12 lg:py-20"
    >
      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={plugins}
        className="mx-auto max-w-7xl"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2
              id="testimonials-heading"
              className="font-serif text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl"
            >
              What Travelers Say
            </h2>
            <p className="mt-2 text-xs text-neutral-500 sm:text-sm">
              Real experiences from our happy travelers
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 pb-1">
            <CarouselPrevious
              size="icon-lg"
              className="static inset-auto my-0 size-10 border-neutral-300 bg-white text-neutral-400 hover:border-neutral-400 hover:bg-white hover:text-neutral-700 disabled:opacity-40"
            />
            <CarouselNext
              size="icon-lg"
              className="static inset-auto my-0 size-10 border-neutral-300 bg-white text-neutral-400 hover:border-neutral-400 hover:bg-white hover:text-neutral-700 disabled:opacity-40"
            />
          </div>
        </div>

        <CarouselContent className="-ml-5 mt-8">
          {testimonials.map((testimonial) => (
            <CarouselItem
              key={testimonial.name}
              className="pl-5 md:basis-1/2"
            >
              <article className="flex h-full items-stretch gap-4 border border-neutral-200 bg-white p-4 sm:gap-5 sm:p-6">
                <div className="flex flex-1 flex-col justify-between gap-6">
                  <blockquote className="font-serif text-[15px] leading-snug text-neutral-800">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  <footer className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="h-px w-4 shrink-0 bg-[#10a5c4]"
                    />
                    <div>
                      <p className="text-sm font-medium text-[#10a5c4]">
                        {testimonial.name}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {testimonial.location}
                      </p>
                    </div>
                  </footer>
                </div>

                <div className="relative w-30 shrink-0 overflow-hidden bg-neutral-100 sm:w-40">
                  <Image
                    src={testimonial.image}
                    alt={`Portrait of ${testimonial.name}`}
                    fill
                    sizes="(min-width: 640px) 160px, 120px"
                    className="object-cover object-center"
                  />
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
