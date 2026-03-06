import { getHomeData } from "@/lib/api/fetch-generated";
import dayjs from "dayjs";
import { NavigationBarClient } from "./navigation-bar-client";

export async function NavigationBar() {
  const response = await getHomeData(dayjs().format("YYYY-MM-DD"));

  const calendarHref = response.status === 200 && response.data.activeWorkoutPlanId
      ? `/workout-plans/${response.data.activeWorkoutPlanId}`
      : `/`;

  return <NavigationBarClient calendarHref={calendarHref} />;
}