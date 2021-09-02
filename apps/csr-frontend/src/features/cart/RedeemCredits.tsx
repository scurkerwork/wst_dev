import { api } from '../../api';
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Title1, Button } from "@whosaidtrue/ui"

const CreditPurchase: React.FC = () => {
    return (
        <>
            <Title1 className="text-center">Purchase with Free Deck Credits</Title1>
            <Button>Yes</Button>
            <Button $secondary>No</Button>
        </>
    )
}

export default CreditPurchase