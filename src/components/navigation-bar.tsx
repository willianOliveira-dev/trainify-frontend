import { getHomeData } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/auth-client";
import dayjs from "dayjs";
import { headers } from "next/headers";
import { NavigationBarClient } from "./navigation-bar-client";
import { redirect } from 'next/navigation'

export async function NavigationBar() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });
  
  let hasActivePlan = false;
  let calendarHref = "/";

  if (session) {
    const response = await getHomeData(dayjs().format("YYYY-MM-DD"));
    
    if (response.status === 200 && response.data.activeWorkoutPlanId) {
      hasActivePlan = true;
      calendarHref = `/workout-plans/${response.data.activeWorkoutPlanId}`;
    }
  } else {
    redirect("/auth");
  }

  return (
    <NavigationBarClient 
      calendarHref={calendarHref}
      hasActivePlan={hasActivePlan}
    />
  );
}