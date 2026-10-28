import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DestinationDetail from "@/components/destinations/destination-detail";
import DestinationDetailSkeleton from "@/components/destinations/destination-detail-skeleton";
import { getDestination } from "@/lib/destinations";

type DestinationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: DestinationPageProps): Promise<Metadata> {
  const { id } = await params;
  const destination = await getDestination(id);

  if (!destination) {
    return { title: "Destination Not Found | Wanderlast" };
  }

  return {
    title: `${destination.destinationName} | Wanderlast`,
    description:
      destination.description ||
      `Discover ${destination.destinationName} in ${destination.country} with Wanderlast.`,
  };
}

async function DestinationResult({ params }: DestinationPageProps) {
  const { id } = await params;
  const destination = await getDestination(id);

  if (!destination) {
    notFound();
  }

  return <DestinationDetail destination={destination} />;
}

export default function DestinationPage({ params }: DestinationPageProps) {
  return (
    <Suspense fallback={<DestinationDetailSkeleton />}>
      <DestinationResult params={params} />
    </Suspense>
  );
}
