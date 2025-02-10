import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserInitials(name: string | null, email: string) {
  if (typeof name === "string") {
    const names = name.split(" ");
    const firstInitial = names[0]?.[0];
    const secondInitial = names[1]?.[0];

    if (firstInitial && secondInitial) {
      return firstInitial + secondInitial;
    }
  }

  return email[0] + email[1]!;
}
