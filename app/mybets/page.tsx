import { getHomePageInitialData } from "@/src/server/markets/pageData";
import HomePageClient from "@/components/HomePageClient";

export const revalidate = 15;

// My bets content now lives in the Profile tab
export default async function MyBetsPage() {
  const initialData = await getHomePageInitialData();

  return (
    <HomePageClient
      initialMarkets={initialData.initialMarkets}
      initialCategories={initialData.initialCategories}
      fetchedAt={initialData.fetchedAt}
    />
  );
}
