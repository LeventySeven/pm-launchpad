import { getHomePageInitialData } from "@/src/server/markets/pageData";
import HomePageClient from "@/components/HomePageClient";

// ISR: regenerate every 15 seconds so the baked HTML stays reasonably fresh.
export const revalidate = 15;

export default async function HomePage() {
  const initialData = await getHomePageInitialData();

  return (
    <HomePageClient
      initialMarkets={initialData.initialMarkets}
      initialCategories={initialData.initialCategories}
      fetchedAt={initialData.fetchedAt}
    />
  );
}
