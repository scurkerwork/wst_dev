declare module "*.svg" {
    import * as React from 'react';
    const content: any;
    export default content;
    const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

    export { ReactComponent }; // this is a workaround so that the typescript compiler stops throwing an error when it sees an SVG
}

declare module "*.webp"
declare module "*.png"