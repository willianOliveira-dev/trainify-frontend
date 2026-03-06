import { getHomeData } from "@/lib/api/fetch-generated";
import dayjs from "dayjs";
import { NavigationBarClient } from "./navigation-bar-client";

export async function NavigationBar() {  
  let hasActivePlan = false;
  let calendarHref = "/";

    const response = await getHomeData(dayjs().format("YYYY-MM-DD"));
    
    if (response.status === 200 && response.data.activeWorkoutPlanId) {
      hasActivePlan = true;
      calendarHref = `/workout-plans/${response.data.activeWorkoutPlanId}`;
    } 

  return (
    <NavigationBarClient 
      calendarHref={calendarHref}
      hasActivePlan={hasActivePlan}
    />
  );
}