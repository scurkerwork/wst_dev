import App from './app/App'
import { pool } from './app/db'
import { logger } from '@whosaidtrue/logger';

const app = new App();

app.listen();

// test db connection, end process if db unreachable
(async () => {
    try {
        await pool.connect();
    } catch {
        logger.fatal('Database unreachable. Exiting node process')
        process.exit(1);
    }

})();

// no dangling connections
process.on('exit', () => pool.end())