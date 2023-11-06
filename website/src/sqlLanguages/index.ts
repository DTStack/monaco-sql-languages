import {
    registerHiveSQLLanguage,
    registerFlinkSQLLanguage,
    registerSparkSQLLanguage,
    registerTrinoSQLLanguage,
} from 'monaco-sql-languages/out/esm/main';
import 'monaco-sql-languages/out/esm/mysql/mysql.contribution';
import 'monaco-sql-languages/out/esm/plsql/plsql.contribution';
import 'monaco-sql-languages/out/esm/pgsql/pgsql.contribution';
import 'monaco-sql-languages/out/esm/sql/sql.contribution';

import { completionService } from './helpers/completionService';

registerFlinkSQLLanguage(completionService);
registerHiveSQLLanguage(completionService);
registerSparkSQLLanguage(completionService);
registerTrinoSQLLanguage(completionService);
