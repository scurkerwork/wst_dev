import Button from './Button';

export default {
    component: Button,
    title: "Button"
}

export const SolidPrimary = () => <Button color="primary">Solid Primary</Button>

export const SolidSubtleStroke = () => <Button color="subtle-stroke">Subtle Stroke</Button>

export const BorderPrimary = () => <Button color="primary" border>Border</Button>

export const BorderSubtleStroke = () => <Button color="subtle-stroke" border>Border Subtle Stroke</Button>

export const SolidSmall = () => <Button color="primary" small>Solid Small</Button>

export const BorderSmall = () => <Button color="primary" border small>Border Small</Button>

export const LargeSolidPill = () => <Button color="primary" pill>Large Solid Pill</Button>

export const LargeBorderPill = () => <Button color="primary" pill border>Large Border Pill</Button>

export const SmallSolidPill = () => <Button color="primary" pill small>Small Solid Pill</Button>

export const SmallBorderPill = () => <Button color="primary" pill small border>Small</Button>

export const BoxShadowPrimary = () => {
    // ignore containing div
    return (
        <div className="bg-blue-200 py-8 flex justify-center flex-row">
            <Button color="primary" boxShadow="shadow-lg" pill border>Large pill with box shadow</Button>
        </div>
    )
}
