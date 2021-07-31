import React from 'react';
import { BodySmall } from '../typography/typography';

export interface IInputGroupProps {
    label: string
}

const InputGroup: React.FC<IInputGroupProps> = ({ label, children }) => {
    return (
        <>
            <BodySmall className="block mb-2">{label}</BodySmall>
            {children}
        </>
    )
}

export default InputGroup;