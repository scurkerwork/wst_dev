import Label from "./RatingLabel";

export default {
    component: Label,
    title: "Card Rating Label"
}

const Template = () => {
    return (
        <Label>PG-13</Label>
    )
}

export const RatingLabel = Template.bind({})