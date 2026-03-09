"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ErrorStateProps {
  title?: string;
  message?: string;
  showSupport?: boolean;
}

export function ErrorState({
  title = "Ops! Algo deu errado",
  message = "Não foi possível carregar seus dados. Tente novamente em alguns instantes.",
  showSupport = true,
}: ErrorStateProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full max-w-md mx-auto flex-col bg-background text-foreground pb-24">
      <div className="relative h-72 w-full overflow-hidden rounded-b-3xl">
        <Image
          src="/home-banner.png"
          alt="Home Banner"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-tr from-black/80 via-black/20 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-between p-5">
          <Image
            src="/logo.png"
            alt="Trainify Logo"
            width={95}
            height={50}
            className="object-contain"
          />
        </div>
      </div>

      <main className="flex flex-col items-center justify-center gap-6 px-5 py-12 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="font-tight text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{message}</p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button onClick={() => router.refresh()} className="w-full">
            Tentar novamente
          </Button>

          {showSupport && (
            <Link href="/suporte" passHref>
              <Button variant="outline" className="w-full">
                Falar com suporte
              </Button>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
