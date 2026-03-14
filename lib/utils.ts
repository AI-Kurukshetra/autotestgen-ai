import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(input));
}

export function getFileExtension(language: string) {
  switch (language.toLowerCase()) {
    case "python":
      return "py";
    case "java":
      return "java";
    case "c#":
      return "cs";
    default:
      return "js";
  }
}

export function getCodeLanguage(language: string) {
  switch (language.toLowerCase()) {
    case "python":
      return "python";
    case "java":
      return "java";
    case "c#":
      return "csharp";
    default:
      return "javascript";
  }
}
