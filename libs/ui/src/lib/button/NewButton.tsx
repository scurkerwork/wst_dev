
import React from 'react';
import tw from 'tailwind-styled-components';

export type ButtonStyle = 'default' | 'big-text' | 'small' | 'inline'

export interface ButtonProps {
    buttonStyle?: ButtonStyle;
    $secondary?: boolean
}

interface ChildProps {
    $secondary?: boolean;
}

// default
const DefaultButton = tw.button<ChildProps>`
    font-label-big
    font-bold
    py-3
    px-8
    rounded-full
    ${(p) => p.$secondary ? 'border-2 border-blue-base text-blue-base bg-white' : 'text-white bg-blue-base'}
`;

// big-text
const BigTextButton = tw.button<ChildProps>``;

// small
const SmallButton = tw.button<ChildProps>``;

// inline
const InlineButton = tw.button<ChildProps>``;



const Button: React.FC<ButtonProps> = ({ buttonStyle, $secondary, children }) => {

    switch (buttonStyle) {
        case 'big-text':
            return $secondary ? <BigTextButton $secondary>{children}</BigTextButton> : <BigTextButton>{children}</BigTextButton>
        case 'small':
            return $secondary ? <SmallButton $secondary>{children}</SmallButton> : <SmallButton>{children}</SmallButton>
        case 'inline':
            return $secondary ? <InlineButton $secondary>{children}</InlineButton> : <InlineButton>{children}</InlineButton>
        default:
            return $secondary ? <DefaultButton $secondary>{children}</DefaultButton> : <DefaultButton>{children}</DefaultButton>
    }
}

export default Button;