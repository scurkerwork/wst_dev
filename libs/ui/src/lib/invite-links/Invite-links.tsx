import tw from "tailwind-styled-components";
import { RiMessengerFill } from '@react-icons/all-files/ri/RiMessengerFill';
import { FaSms } from '@react-icons/all-files/fa/FaSms';
import { IoMdMail } from '@react-icons/all-files/io/IoMdMail';
import Button from '../button/Button'
import Box from '../box/Box';
import { Title1, Headline, BodySmall } from '../typography/Typography';
import React from "react";

const InnerBox = tw.div`
flex
flex-row
self-stretch
items-center
gap-3
md:gap-12
p-4
justify-end
bg-white-ish
rounded-2xl
`
const iconClass = 'text-2xl cursor-pointer'

export interface InviteProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    accessCode: string
}

const Invite: React.FC<InviteProps> = ({ accessCode, children }) => {

    const copyUrl = async (e: React.MouseEvent) => {
        await navigator.clipboard.writeText(`whosaidtrue.com/x/${accessCode}`)
    }

    const copyCode = async (e: React.MouseEvent) => {
        await navigator.clipboard.writeText(accessCode)
    }

    return (
        <div className="md:px-20 mt-8">
            <Box boxstyle="purple-subtle" className="gap-8 p-2 sm:p-4 w-min sm:w-max mb-8 mx-auto">
                <Headline>Share Game Code</Headline>
                <InnerBox>
                    <Title1>{accessCode}</Title1>
                    <Button buttonStyle="inline" $secondary onClick={copyCode}>Copy</Button>
                </InnerBox>
                <InnerBox>
                    <span className="sm:text-body-small text-xs">whosaidtrue.com/x/{accessCode}</span>
                    <Button buttonStyle="inline" $secondary type="button" onClick={copyUrl}>Copy</Button>
                </InnerBox>
                <div className="flex flex-row p-4 bg-white-ish rounded-2xl justify-center self-stretch gap-3 md:gap-12">
                    <Headline>Share via:</Headline>
                    <div className="flex flex-row gap-4">
                        <IoMdMail className={iconClass} />
                        <FaSms className={iconClass} />
                        <RiMessengerFill className={iconClass} />
                    </div>
                </div>
            </Box>
            {children}
        </div>
    )
}

export default Invite