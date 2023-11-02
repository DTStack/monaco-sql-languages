import './sql/sql.contribution';
import './mysql/mysql.contribution';
import './plsql/plsql.contribution';
import './pgsql/pgsql.contribution';

import { registerFlinkSQLLanguage } from './flinksql/flinksql.contribution';
import { registerSparkSQLLanguage } from './sparksql/sparksql.contribution';
import { registerHiveSQLLanguage } from './hivesql/hivesql.contribution';
import { registerTrinoSQLLanguage } from './trinosql/trinosql.contribution';

registerFlinkSQLLanguage();
registerSparkSQLLanguage();
registerHiveSQLLanguage();
registerTrinoSQLLanguage();
