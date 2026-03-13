"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session, router]);

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });
  };

  if (isPending || session) {
    return null;
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-black">
   
    <div className="absolute inset-0 z-0 md:relative md:inset-auto md:w-1/2 md:shrink-0">
      <Image
        src="/login-bg.png"
        alt="Login Background"
        fill
        className="object-cover opacity-60 md:opacity-100"
        priority
      />
    </div>

    <div className="absolute inset-0 z-10 hidden md:flex items-start justify-start p-10">
      <Image
        src="/logo.png"
        alt="Trainify Logo"
        width={120}
        height={120}
        priority
      />
    </div>


    <div className="absolute top-8 left-1/2 z-20 -translate-x-1/2 md:hidden">
      <Image
        src="/logo.png"
        alt="Trainify Logo"
        width={100}
        height={100}
        priority
      />
    </div>

    
    <div
      className={cn(
        "relative z-10 mt-auto flex w-full flex-col items-center gap-8 rounded-t-3xl px-5 pt-16 pb-10 bg-primary",
        "md:mt-0 md:w-1/2 md:rounded-none md:justify-center md:gap-12 md:px-16 md:py-0",
      )}
    >
      <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left md:mt-0">
        <h1 className="font-tight text-2xl leading-tight font-semibold text-white sm:text-3xl md:text-4xl lg:text-5xl">
          O app que vai transformar a forma como você treina.
        </h1>
        <p className="hidden md:block text-white/70 text-sm leading-relaxed">
          Treinos personalizados com IA, acompanhamento de progresso e muito
          mais. Comece agora gratuitamente.
        </p>
        <Button
          onClick={handleGoogleLogin}
          className="h-10 cursor-pointer gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90 md:h-12 md:px-8 md:text-base"
        >
          <Image src="/google-icon.svg" alt="Google" width={16} height={16} />
          Fazer login com Google
        </Button>
      </div>

      <p className="text-xs text-white/70">
        <Link
          className="group flex items-center gap-2"
          href="https://github.com/willianOliveira-dev"
        >
          Feito com{" "}
          <Heart className="size-4 fill-current text-red-500 duration-300 group-hover:text-red-400" />{" "}
          por{" "}
          <span className="font-semibold duration-300 group-hover:text-purple-300">
            Willian Oliveira
          </span>
        </Link>
      </p>
    </div>
  </div>
);
  
}
