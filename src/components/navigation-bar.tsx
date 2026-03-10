import { getHomeData } from "@/lib/api/fetch-generated";
import dayjs from "dayjs";
import { BottomNav } from "./bottom-nav";
import { SidebarNav } from "./sidebar-nav";

interface NavigationBarProps {
  activePage?: "home" | "calendar" | "stats" | "profile";
}

export async function NavigationBar({
  activePage = "home",
}: NavigationBarProps) {
  const today = dayjs();
  const homeData = await getHomeData(today.format("YYYY-MM-DD"));

  const calendarHref =
    homeData.status === 200 && homeData.data.activeWorkoutPlanId
      ? `/workout-plans/${homeData.data.activeWorkoutPlanId}`
      : null;

  return (
    <>
     
      <SidebarNav activePage={activePage} calendarHref={calendarHref} />
      <BottomNav activePage={activePage} calendarHref={calendarHref} />
    </>
  );
}