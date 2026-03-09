"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultChatTransport } from "ai";
import { ArrowUp, Sparkles, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Streamdown } from "streamdown";
import "streamdown/styles.css";
import { z } from "zod";

const SUGGESTED_MESSAGES = ["Monte meu plano de treino"];

const chatFormSchema = z.object({
  message: z.string().min(1),
});

type ChatFormValues = z.infer<typeof chatFormSchema>;

interface ChatProps {
  embedded?: boolean;
  initialMessage?: string;
}

export function AiChatbot({ embedded = false, initialMessage }: ChatProps) {
  const [chatParams, setChatParams] = useQueryStates({
    chat_open: parseAsBoolean.withDefault(false),
    chat_initial_message: parseAsString,
  });

  const [streamdownKey, setStreamdownKey] = useState(0);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/trainify/api/v1/ai/chat`,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }),
    onError: (error) => {
      console.error("Erro no chat:", error);
    },
    onFinish: () => {
      // Força atualização do Streamdown quando terminar
      setStreamdownKey((prev) => prev + 1);
    },
  });

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: { message: "" },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMessageSentRef = useRef(false);

  useEffect(() => {
    if (embedded && initialMessage && !initialMessageSentRef.current) {
      initialMessageSentRef.current = true;
      sendMessage({ text: initialMessage });
    }
  }, [embedded, initialMessage, sendMessage]);

  useEffect(() => {
    if (
      !embedded &&
      chatParams.chat_open &&
      chatParams.chat_initial_message &&
      !initialMessageSentRef.current
    ) {
      initialMessageSentRef.current = true;
      sendMessage({ text: chatParams.chat_initial_message });
      setChatParams({ chat_initial_message: null });
    }
  }, [
    embedded,
    chatParams.chat_open,
    chatParams.chat_initial_message,
    sendMessage,
    setChatParams,
  ]);

  useEffect(() => {
    if (!embedded && !chatParams.chat_open) {
      initialMessageSentRef.current = false;
    }
  }, [embedded, chatParams.chat_open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!embedded && !chatParams.chat_open) return null;

  const handleClose = () => {
    setChatParams({ chat_open: false, chat_initial_message: null });
  };

  const onSubmit = (values: ChatFormValues) => {
    sendMessage({ text: values.message });
    form.reset();
  };

  const handleSuggestion = (text: string) => {
    sendMessage({ text });
  };

  const isStreaming = status === "streaming";
  const isLoading = status === "submitted" || isStreaming;

  const chatContent = (
    <div
      className={
        embedded
          ? "flex h-svh flex-col bg-background"
          : "flex flex-1 flex-col overflow-hidden rounded-[20px] bg-background border border-border shadow-lg"
      }
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary/10 p-1.5">
            <Image
              src="/logo.png"
              alt="Trainify Logo"
              width={32}
              height={32}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-tight text-base font-semibold text-foreground">
              Trainify AI
            </span>
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <div className="absolute h-2 w-2 animate-ping rounded-full bg-online/75" />
                <div className="h-2 w-2 rounded-full bg-online" />
              </div>
              <span className="font-tight text-xs text-muted-foreground">
                Online • Trainify
              </span>
            </div>
          </div>
        </div>

        {embedded ? (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="font-tight text-primary hover:text-primary/80"
          >
            <Link href="/">Acessar FIT.AI</Link>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="hover:bg-secondary/80"
          >
            <X className="size-5 text-foreground/70" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scroll-smooth px-4 py-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              {message.role === "assistant" && (
                <div className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-3 w-3 text-primary" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  message.role === "assistant"
                    ? "bg-secondary/50 backdrop-blur-sm text-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {message.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        const isLastMessage =
                          messages[messages.length - 1]?.id === message.id;

                        return (
                          <Streamdown
                            key={`${message.id}-part-${index}`}
                            isAnimating={isStreaming && isLastMessage}
                            className="font-tight text-sm leading-relaxed"
                          >
                            {part.text}
                          </Streamdown>
                        );
                      }
                      return null;
                    })}
                  </div>
                ) : (
                  <p className="font-tight text-sm leading-relaxed">
                    {message.parts
                      .filter((part) => part.type === "text")
                      .map(
                        (part) => (part as { type: "text"; text: string }).text,
                      )
                      .join("")}
                  </p>
                )}
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-3 w-3 animate-spin text-primary" />
              </div>
              <div className="rounded-2xl bg-secondary/50 backdrop-blur-sm px-4 py-3">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary/40 [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-card/30 p-4">
        {messages.length === 0 && (
          <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
            {SUGGESTED_MESSAGES.map((suggestion) => (
              <Button
                key={suggestion}
                onClick={() => handleSuggestion(suggestion)}
                variant="outline"
                className="whitespace-nowrap rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 font-tight text-sm text-foreground hover:bg-primary/10"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Digite sua mensagem..."
                      className="h-11 rounded-full border-border/50 bg-secondary/30 px-5 font-tight text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/30"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!form.watch("message").trim() || isLoading}
              size="icon"
              className="h-11 w-11 shrink-0 rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 disabled:opacity-50"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );

  if (embedded) return chatContent;

  return (
    <div className="fixed inset-0 z-60">
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="absolute inset-x-4 bottom-4 top-20 flex flex-col md:inset-x-8 md:top-24 lg:inset-x-auto lg:left-1/2 lg:top-1/2 lg:w-[600px] lg:-translate-x-1/2 lg:-translate-y-1/2">
        {chatContent}
      </div>
    </div>
  );
}
