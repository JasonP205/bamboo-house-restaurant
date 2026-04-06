import { twMerge } from "tailwind-merge";
import clsx from "clsx";

const cn = (...inputs: Parameters<typeof clsx>) => twMerge(clsx(...inputs));
const formatTitle = (str: string) =>
  str
    ?.trim()
    .split(" ")
    .map(w => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
export { cn, formatTitle };