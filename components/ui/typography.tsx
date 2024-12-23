import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";


export function H1({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 {...props} className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)}>
      {children}
    </h1>
  )
}

export function H2({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 {...props} className={cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0", className)}>
      {children}
    </h2>
  )
}

export function H3({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 {...props} className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)}>
      {children}
    </h3>
  )
}

export function H4({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4 {...props} className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)}>
      {children}
    </h4>
  )
}

export function P({ children, className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p {...props} className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)}>
      {children}
    </p>
  )
}
