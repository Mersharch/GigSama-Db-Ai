import { Conversation } from "@/state/AppContext";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLatestValidSchema(
  conversation: Conversation[]
): Conversation | null {
  for (let i = conversation.length - 1; i >= 0; i--) {
    if (conversation[i].schemaCode) {
      return conversation[i];
    }
  }
  return null;
}
