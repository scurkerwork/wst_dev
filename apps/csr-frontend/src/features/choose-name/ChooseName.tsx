import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectNameRerolls, setGameStatus, setRemainingNameOptions, setCurrentNameOptions, selectCurrentNameOptions } from '../../features';
import { LargeTitle, Button, RerollNamesButton, Box, TextInput, Headline, WrappedButton } from '@whosaidtrue/ui';
import { NameObject, NameRequestResponse } from '@whosaidtrue/api-interfaces';
import { api } from '../../api'

const ChooseName: React.FC = () => {
    const dispatch = useAppDispatch();
    const names = useAppSelector(selectCurrentNameOptions);
    const rerolls = useAppSelector(selectNameRerolls);

    const [nameRequestErr, setNameRequestErr] = useState('')

    // get a batch of 6 names when user first arrives
    useEffect(() => {
        dispatch(setGameStatus('choosingName'));

        // TODO: check url params for a code, and redirect/wipe game state if absent. Need to find out
        // what kind of messages should be displayed.

        // get names from server
        (async () => {
            try {
                const response = await api.get<NameRequestResponse>('/names')
                dispatch(setRemainingNameOptions(response.data.names)) // populate total name pool
                dispatch(setCurrentNameOptions()) // set initial set of options and remove them from pool
            } catch (e) {
                // TODO: figure out error handling
                console.error(e)
                dispatch(setGameStatus('notInGame'))
            }
        })()
    }, [])
    const chooseName = (name: NameObject) => {
        // TODO: find out what the interface with the socket server will be.
        return (e: React.MouseEvent) => {
            e.preventDefault();
        }
    }

    const namesHelper = (names: NameObject[]) => {
        return names.map((nameObj, i) => {
            return <WrappedButton color="blue" key={i} fontSize="jumbo" onClick={chooseName(nameObj)} className="place-self-stretch" type="button">{nameObj.name}</WrappedButton>
        })
    }

    const rerollHandler = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(setCurrentNameOptions());
    }

    return (
        <Box boxstyle='white' className="w-max mx-auto px-8 py-10">
            <LargeTitle>Choose Your Player Name</LargeTitle>
            <div className="flex flex-col gap-3 w-96 mt-10 flex-shrink">
                {namesHelper(names)}
                <div className="flex items-center justify-center mt-4">
                    <RerollNamesButton onClick={rerollHandler} rerolls={rerolls} />
                </div>
            </div>
            <div className="flex flex-col items-center gap-4 mt-10 w-full">
                <Headline className="block">Or</Headline>
                <div className="flex w-full gap-3">
                    <TextInput $border type="text" className="font-semibold text-xl inline w-1/3" placeholder="Create your own" />
                    <Button className="w-2/3 inline" border="thick" $pill fontSize="jumbo">Submit</Button>
                </div>
            </div>
        </Box>
    )
}

export default ChooseName;