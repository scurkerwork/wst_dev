import tw from "tailwind-styled-components";
import { ThemeColor, Extends } from "@whosaidtrue/app-interfaces";


export type ButtonColor = Extends<ThemeColor, "primary" | "subtle-stroke">;

export interface ButtonProps {
    border?: boolean;
    small?: boolean;
    color: ButtonColor;
    pill?: boolean;
    boxShadow?: 'shadow-sm' | 'shadow' | 'shadow-md' | 'shadow-lg' | 'shadow-xl' | 'shadow-2xl'
}

const colorHelper = (color: ButtonColor, border: boolean | undefined): string => {
    const borderBase = "border-2 bg-white";
    if (color === "primary") {
        if (border) {
            return `${borderBase} text-primary border-primary`
        } else {
            return "bg-primary text-white"
        }
    } else {
        if (border) {
            return `${borderBase} text-subtle-stroke border-subtle-stroke`
        } else {
            return "bg-subtle-stroke text-white"
        }
    }
}


export default tw.button<ButtonProps>`
    box-content
    ${(p) => p.boxShadow ? p.boxShadow : ""}
    ${(p) => p.small ? "py-1 px-2 text-sm" : "py-4 px-8"}
    ${(p) => colorHelper(p.color, p.border)}
    ${(p) => p.pill ? "rounded-full" : "rounded-lg"}


`