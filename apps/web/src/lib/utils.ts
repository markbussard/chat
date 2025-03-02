import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserInitials(
  name: string | null | undefined,
  email: string
) {
  if (name) {
    const names = name.split(" ");
    if (names.length > 1) {
      // If the name contains multiple words, return the first letter of the first
      // and last word.
      return (
        names[0]![0]!.toUpperCase() + names[names.length - 1]![0]!.toUpperCase()
      );
    }
  }

  const emailUsername = email.split("@")[0];

  // If the email doesn't contain a dot, return the first character of the username
  // as the initial.
  if (!emailUsername) {
    return "";
  }

  const emailParts = emailUsername.split(".");
  if (emailParts.length === 1) {
    return emailUsername[0]!.toUpperCase();
  }

  if (emailParts.length > 1) {
    return emailParts
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }
}

// function to get typesafe errors
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Unknown error";
}

/**
 * Safely extracts error message from any caught error
 * @param error - The caught error (unknown type)
 * @param fallbackMessage - Optional fallback message if error can't be parsed
 * @returns A properly typed error object with message
 */
export function parseError(
  error: unknown,
  fallbackMessage = "An unexpected error occurred"
): {
  message: string;
  original: unknown;
} {
  // Handle Error instances
  if (error instanceof Error) {
    return {
      message: error.message,
      original: error
    };
  }

  // Handle string errors
  if (typeof error === "string") {
    return {
      message: error,
      original: error
    };
  }

  // Handle objects with message property
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return {
      message: error.message,
      original: error
    };
  }

  // Return fallback for everything else
  return {
    message: fallbackMessage,
    original: error
  };
}
