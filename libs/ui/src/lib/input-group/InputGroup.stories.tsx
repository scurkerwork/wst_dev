import InputGroup, { IInputGroupProps } from "./InputGroup";
import TextInput from '../text-input/TextInput';
import { Story, Meta } from '@storybook/react';
import TextArea from "../text-area/TextArea";

export default {
    component: InputGroup,
    title: 'Input Group',
    argTypes: {
        label: {
            type: 'string',
            description: "Label for input element"
        }
    },
    parameters: {
        docs: {
            source: {
                type: 'code'
            }
        }
    }

} as Meta;

const Template: Story<IInputGroupProps> = ({ label }) => {
    return (
        <InputGroup label={label}>
            <TextInput type="text" />
        </InputGroup>
    )
}

export const TextInputGroup = Template.bind({});

TextInputGroup.args = {
    label: "Name"
}

const AreaTemplate: Story<IInputGroupProps> = ({ label }) => {
    return (
        <InputGroup label={label}>
            <TextArea />
        </InputGroup>
    )
}
export const TextAreaGroup = AreaTemplate.bind({});

TextAreaGroup.args = {
    label: "Question"
}