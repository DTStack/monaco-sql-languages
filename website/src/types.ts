import { TreeNodeModel } from '@dtinsight/molecule/esm/utils/tree';
import { LanguageIdEnum } from 'monaco-sql-languages/out/esm/main.js';

export type TreeNode = TreeNodeModel<{ language: LanguageIdEnum }>;
