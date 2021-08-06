/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {

    // deck table
    pgm.createTable('userDecks', {
        id: 'id',
        name: { type: 'varchar(1000)', notNull: true }
    })

}

export async function down(pgm: MigrationBuilder): Promise<void> {
}
