import { getHomePageInitialData } from "@/src/server/markets/pageData";
import HomePageClient from "@/components/HomePageClient";

export const revalidate = 15;

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  const initialData = await getHomePageInitialData();

  return (
    <HomePageClient
      initialMarkets={initialData.initialMarkets}
      initialCategories={initialData.initialCategories}
      fetchedAt={initialData.fetchedAt}
      initialProfileUsername={username}
    />
  );
}
