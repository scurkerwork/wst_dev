import tw from 'tailwind-styled-components';

const Container = tw.div`
    bg-purple-subtle-fill
    border-2
    border-purple-subtle-stroke
    md:text-2xl
    sm:text-xl
    text-lg
    sm:py-6
    sm:px-4
    p-4
    md:py-8
    mt-2
    md:px-6
    mx-auto
    mb-12
    w-max
    text-black
    flex
    flex-col
    rounded-3xl
    items-center
    select-none
`

const OneLiners: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = ({ children }) => {
    return (
        <Container>
            <span>While you were waiting:</span>
            <div className="font-black">
                "{children}"
            </div>
        </Container>
    )
}

export default OneLiners;