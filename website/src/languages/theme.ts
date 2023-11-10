import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import { vsPlusTheme } from 'monaco-sql-languages/out/esm/main';

editor.defineTheme('sql-dark', vsPlusTheme.darkThemeData);
editor.defineTheme('sql-light', vsPlusTheme.lightThemeData);
editor.defineTheme('sql-hc', vsPlusTheme.hcBlackThemeData);
