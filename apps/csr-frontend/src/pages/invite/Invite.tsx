import tw from "tailwind-styled-components";
import { RiMessengerFill } from '@react-icons/all-files/ri/RiMessengerFill';
import { FaSms } from '@react-icons/all-files/fa/FaSms';
import { IoMdMail } from '@react-icons/all-files/io/IoMdMail';

import { NoFlexBox, Button, Box, Title3, BodyMedium, Title1, Headline, BodySmall } from '@whosaidtrue/ui';

const InnerBox = tw.div`
flex
flex-row
self-stretch
items-center
gap-12
p-4
justify-end
bg-white-ish
rounded-2xl
`
const iconClass = 'text-2xl cursor-pointer'
const Invite: React.FC = () => {
    return (
        <NoFlexBox className="w-max mx-auto text-basic-black text-center pb-16">

            <Title1 className="mb-8">Invite Players</Title1>
            <Title3 className="mb-8">Tell Players to Enter Game Code at WhoSaidTrue.com</Title3>
            <div className="px-20 mt-8">
                <Box boxstyle="purple-subtle" className="gap-8 p-4 mb-8">
                    <Headline>Share Game Code</Headline>
                    <InnerBox>
                        <Title1>XYV1FC</Title1>
                        <Button buttonStyle="inline" $secondary>Copy</Button>
                    </InnerBox>
                    <InnerBox>
                        <BodySmall>whosaidtrue.com/x/XYV1FC</BodySmall>
                        <Button buttonStyle="inline" $secondary>Copy</Button>
                    </InnerBox>
                    <div className="flex flex-row p-4 bg-white-ish rounded-2xl justify-center self-stretch gap-12">
                        <Headline>Share via:</Headline>
                        <div className="flex flex-row gap-4">
                            <IoMdMail className={iconClass} />
                            <FaSms className={iconClass} />
                            <RiMessengerFill className={iconClass} />
                        </div>
                    </div>
                </Box>
                <Button >Choose Your Player name</Button>
            </div>

        </NoFlexBox>
    )
}

export default Invite