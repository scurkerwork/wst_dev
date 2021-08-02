import React from 'react';
import tw from "tailwind-styled-components";

const Styled = tw.input`
    form-input
    border-1
    border-primary
    rounded-xl
    h-24
    w-20
    bg-subtle-bg
    text-primary
    text-title-1
    text-center
    cursor-pointer
`

const DigitInput: React.FC = (props) => <Styled type="text" maxLength={1} size={1} min={0} max={9} pattern="[0-9]{1}" />

export default DigitInput