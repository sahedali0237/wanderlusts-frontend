import Image from "next/image";

const features = [
  {
    icon: "/assets/ShieldCheck.png",
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
  },
  {
    icon: "/assets/MapTrifold.png",
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
  },
  {
    icon: "/assets/Headset.png",
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      aria-labelledby="why-choose-heading"
      className="w-full bg-[#e8f6fc] px-4 py-16 sm:px-8 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-7xl bg-[#f8fcfe] p-2">
        <div className="px-4 pb-6 pt-0 text-center sm:px-6">
          <h2
            id="why-choose-heading"
            className="font-serif text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl"
          >
            Why Choose <span className="font-bold">Wanderlast</span>
          </h2>
          <p className="mt-2 text-xs text-neutral-500 sm:text-sm">
            Your trusted partner for exceptional travel experiences
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="bg-white px-6 py-5">
              <Image
                src={feature.icon}
                alt=""
                width={48}
                height={48}
                className="h-8 w-8 object-contain"
              />
              <h3 className="mt-4 font-serif text-xl font-medium text-neutral-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-neutral-500">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
