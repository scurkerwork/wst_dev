/**
 * Utility type function for creating objects.
 *
 * Database entities always have id, created_at, and updated_at columns.
 * These attributes are therefore included in the interfaces
 * that correspond to those entities.
 *
 * However, there is often a need to use those interfaces before
 * those attributes are actually assigned by the database
 * (e.g. when constructing an object prior to an insert query).
 *
 * This utility function makes it easy to contruct a type that
 * is identical to the parameter type, minus the id, created_at,
 * and updated_at attributes. This function can be used instead
 * of creating and maintaining a separate interface for inserts.
 *
 * @example
 * interface MyInterface {
 *  id: number;
 *  myAttribute: string;
 *  created_at: Date;
 *  updated_at: Date;
 * }
 *
 * type Excluded = InsertCreator<MyInterface> // type Excluded = { myAttribute: string }
 *
 */
export type InsertCreator<T> = Exclude<T, 'id' | 'created_at' | 'updated_at'>;