import { twMerge } from "tailwind-merge";
import clsx from "clsx";

const cn = (...inputs: Parameters<typeof clsx>) => twMerge(clsx(...inputs));

export { cn };