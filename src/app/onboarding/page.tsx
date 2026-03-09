import { AiChatbot } from "@/components/ai-chatbot";
import { getHomeData, getMe } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/auth-client";
import dayjs from "dayjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const [homeData, trainData] = await Promise.all([
    getHomeData(dayjs().format("YYYY-MM-DD")),
    getMe(),
  ]);

  if (
    homeData.status === 200 &&
    trainData.status === 200 &&
    homeData.data.activeWorkoutPlanId &&
    trainData.data
  ) {
    redirect("/");
  }

  return (
    <AiChatbot
      embedded
      initialMessage="Quero começar a melhorar minha saúde!"
    />
  );
}
