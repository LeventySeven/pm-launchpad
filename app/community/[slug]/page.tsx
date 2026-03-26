import { getHomePageInitialData } from "@/src/server/markets/pageData";
import HomePageClient from "@/components/HomePageClient";

export const revalidate = 15;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CommunityPage({ params }: PageProps) {
  const { slug } = await params;
  const initialData = await getHomePageInitialData();

  return (
    <HomePageClient
      initialMarkets={initialData.initialMarkets}
      initialCategories={initialData.initialCategories}
      fetchedAt={initialData.fetchedAt}
      initialCommunitySlug={slug}
    />
  );
}
