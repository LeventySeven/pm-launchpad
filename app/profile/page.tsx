import { getHomePageInitialData } from "@/src/server/markets/pageData";
import HomePageClient from "@/components/HomePageClient";

export const revalidate = 15;

export default async function ProfilePageRoute() {
  const initialData = await getHomePageInitialData();

  return (
    <HomePageClient
      initialMarkets={initialData.initialMarkets}
      initialCategories={initialData.initialCategories}
      fetchedAt={initialData.fetchedAt}
    />
  );
}
