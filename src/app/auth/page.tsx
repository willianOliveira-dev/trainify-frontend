"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
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
    <div className="relative flex h-screen w-full flex-col items-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image
          src="/login-bg.png"
          alt="Login Background"
          fill
          className="object-cover opacity-60"
          priority
        />
      </div>

      <div className="relative z-10 mt-12 flex size-32 items-center justify-center">
        <Image
          src="/logo.png"
          alt="Trainify Logo"
          width={130}
          height={130}
          priority
        />
      </div>
      <div className="bg-primary relative z-10 mt-auto flex w-full max-w-md flex-col items-center gap-16 rounded-t-3xl px-5 pt-12 pb-10">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="font-tight text-3xl leading-tight font-semibold text-white">
            O app que vai transformar a forma como você treina.
          </h1>

          <Button
            onClick={handleGoogleLogin}
            className="h-10 cursor-pointer gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90"
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
