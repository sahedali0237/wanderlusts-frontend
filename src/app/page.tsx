import Hero from "@/components/hero";
import Testimonials from "@/components/testimonials";
import WhyChooseUs from "@/components/why-choose-us";
import BookTrip from "@/components/book-trip";
import DestinationsCarousel from "@/components/destinations-carousel";

export default function Home() {
  return (
    <>
      <Hero />
      <DestinationsCarousel />
      <WhyChooseUs />
      <Testimonials />
      <BookTrip />
    </>
  );
}
