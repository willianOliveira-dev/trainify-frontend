import { LogoutButton } from "@/components/logout-button";
import { NavigationBar } from "@/components/navigation-bar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getHomeData, getMe } from "@/lib/api/fetch-generated";
import { authClient } from "@/lib/auth-client";
import dayjs from "dayjs";
import { BicepsFlexed, Ruler, User, Weight } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const [trainData, homeData] = await Promise.all([
    getMe(),
    getHomeData(dayjs().format("YYYY-MM-DD")),
  ]);

  if (trainData.status !== 200) {
    throw new Error("Failed to fetch user train data");
  }

  const needsOnboarding =
    (homeData.status === 200 && !homeData.data.activeWorkoutPlanId) ||
    !trainData.data;

  if (needsOnboarding) redirect("/onboarding");

  const user = session.data.user;
  const data = trainData.data;

  const weightInKg = data ? data.weightInGrams / 1000 : null;
  const heightInCm = data?.heightInCentimeters ?? null;
  const bodyFatPercentage = data?.bodyFatPercentage ?? null;
  const age = data?.age ?? null;

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="flex h-[56px] items-center px-5">
        <Image
          src="/logo.png"
          alt="Trainify logo"
          width={80}
          height={25}
          priority={true}
        />
      </div>

      <div className="flex flex-col items-center gap-5 px-5 pt-5">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-[52px]">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1.5">
              <h1 className="font-heading text-lg font-semibold leading-[1.05] text-foreground">
                {user.name}
              </h1>
              <p className="font-heading text-sm leading-[1.15] text-foreground/70">
                Plano Basico
              </p>
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-3">
          <div className="flex flex-col items-center gap-5 rounded-xl bg-primary/8 p-5">
            <div className="flex items-center rounded-full bg-primary/8 p-[9px]">
              <Weight className="size-4 text-primary" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="font-heading text-2xl font-semibold leading-[1.15] text-foreground">
                {weightInKg ?? "-"}
              </span>
              <span className="font-heading text-xs uppercase leading-[1.4] text-muted-foreground">
                Kg
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 rounded-xl bg-primary/8 p-5">
            <div className="flex items-center rounded-full bg-primary/8 p-[9px]">
              <Ruler className="size-4 text-primary" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="font-heading text-2xl font-semibold leading-[1.15] text-foreground">
                {heightInCm ?? "-"}
              </span>
              <span className="font-heading text-xs uppercase leading-[1.4] text-muted-foreground">
                Cm
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 rounded-xl bg-primary/8 p-5">
            <div className="flex items-center rounded-full bg-primary/8 p-[9px]">
              <BicepsFlexed className="size-4 text-primary" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="font-heading text-2xl font-semibold leading-[1.15] text-foreground">
                {bodyFatPercentage != null ? `${bodyFatPercentage}%` : "-"}
              </span>
              <span className="font-heading text-xs uppercase leading-[1.4] text-muted-foreground">
                Gc
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 rounded-xl bg-primary/8 p-5">
            <div className="flex items-center rounded-full bg-primary/8 p-[9px]">
              <User className="size-4 text-primary" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <span className="font-heading text-2xl font-semibold leading-[1.15] text-foreground">
                {age ?? "-"}
              </span>
              <span className="font-heading text-xs uppercase leading-[1.4] text-muted-foreground">
                Anos
              </span>
            </div>
          </div>
        </div>

        <LogoutButton />
      </div>

      <NavigationBar activePage="profile" />
    </div>
  );
}
