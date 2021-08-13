/**
 * Generic object type used to create update queries via the updateQueryBuilder
 */
export type UpdateObject = Record<string, unknown>;

/**
 * Generic object type used to create insert queries via the insertQueryBuilder
 */
export type InsertObject = Record<string, unknown>;


/**
 * Create a SQL update query from an object.
 * The keys of the object will be used as the column names.
 * The values of those keys will be used to set the new value of the column.
 *
 * @example
 * const nameUpdate = {
 *  name: 'New Name'
 * }
 *
 * const query = updateQueryBuilder(nameUpdate);
 *
 * WARNING: DO NOT USE FOR MONEY VALUES WITHOUT CONVERTING MONEY VALUES TO STRING FIRST.
 *
 * console.log(query) // "SET name = 'New Name'"
 *
 * @param {Record<string, unknown} updateObject an object containing the values for the update
 * @returns {string} A SQL query that sets the values specified in the update Object
 */
export const updateQueryBuilder = (updateObject: UpdateObject): string => {
    let queryString = "SET ";

    // loop through keys
    Object.keys(updateObject).forEach(key => {
        // clean up value type and push next part of query string
        queryString += `${key} = ${cleanValue(updateObject[key])}`;
    })

    return queryString;
}

/**
 * Create a SQL insert query from an object.
 * The keys of the object will be used as the column names.
 * The values of those keys will be used to set the new value of the column.
 *
 * @example
 * const user = {
 *  name: 'John'
 * }
 *
 * const query = insertQueryBuilder(nameUpdate);
 *
 * WARNING: DO NOT USE FOR MONEY VALUES WITHOUT CONVERTING MONEY VALUES TO STRINGS FIRST.
 *
 * console.log(query) // "("name") VALUES 'John'"
 *
 * @param {Record<string, unknown} updateObject an object containing the values for the update
 * @returns {string} A SQL query that sets the values specified in the update Object
 */
export const insertQueryBuilder = (insertObject: InsertObject): string => {
    let columnNames = "(";
    let values = "("

    // loop through keys and make lists of columns and values
    Object.keys(insertObject).forEach(key => {

        // add column name to list
        columnNames += `"${key}", `;

        // add cleaned value to list
        values += `${cleanValue(insertObject[key])}, `

    })

    return `${stripComma(columnNames)} VALUES ${stripComma(values)}`;
}

const cleanValue = (value: unknown): unknown => {
    let result = value;

    // add single quotes around string values
    if (typeof result === 'string') {
        result = `'${result}'`;
    }

    // set undefined to null (postgres doesn't know what undefined is)
    if (result === undefined) {
        result = null;
    }

    return result
}

/**
 * Replace last 2 characters at the end of a string with ')'.
 *
 * @param {string} input
 * @return {*}  {string}
 */
const stripComma = (input: string): string => {
    return `${input.slice(0, -2)})`
}