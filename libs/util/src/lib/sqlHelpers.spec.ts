import { updateQueryBuilder, insertQueryBuilder } from './sqlHelpers';
describe('updateQueryBuilder', () => {

    it('Should add double quotes around string values', () => {
        const update = {
            attribute: 'I am a string'
        }

        const actual = updateQueryBuilder(update);
        expect(actual).toEqual("SET attribute = 'I am a string'")
    })

    it('should change undefined into null', () => {
        const update = {
            attribute: undefined
        }

        const actual = updateQueryBuilder(update);
        expect(actual).toEqual('SET attribute = null')
    })

    it('should correctly cast numbers', () => {
        const update = {
            attribute: 1
        }

        const actual = updateQueryBuilder(update);
        expect(actual).toEqual('SET attribute = 1')
    })
})

describe('insertQueryBuilder', () => {
    it('should return a correct insert query segment', () => {
        const insert = {
            name: 'Name',
            num: 1,
            dt: new Date('06/06/2021').toISOString(),
            undef: undefined,
            nu: null
        }

        const actual = insertQueryBuilder(insert);
        expect(actual).toEqual('("name", "num", "dt", "undef", "nu") VALUES (\'Name\', 1, \'2021-06-06T04:00:00.000Z\', null, null)')
    })
})