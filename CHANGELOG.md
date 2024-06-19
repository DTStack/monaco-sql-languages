# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.12.2](https://github.com/DTStack/monaco-sql-languages/compare/v0.12.1...v0.12.2) (2024-06-19)


### Bug Fixes

* [#134](https://github.com/DTStack/monaco-sql-languages/issues/134) upgrade dt-sql-parser@4.0.2 ([c9d381d](https://github.com/DTStack/monaco-sql-languages/commit/c9d381dc6ad836499491c39eeb66b6869d8b4c21))

### [0.12.1](https://github.com/DTStack/monaco-sql-languages/compare/v0.12.0...v0.12.1) (2024-06-19)


### Bug Fixes

* [#132](https://github.com/DTStack/monaco-sql-languages/issues/132) optimize provideCompletionItems insertTextRules ([#133](https://github.com/DTStack/monaco-sql-languages/issues/133)) ([802f4cd](https://github.com/DTStack/monaco-sql-languages/commit/802f4cdcab33086b8c4fc4bd424cd6d2ddfb98d9))

## [0.12.0](https://github.com/DTStack/monaco-sql-languages/compare/v0.12.0-beta.13...v0.12.0) (2024-04-30)


### Features

* remove deprecated exports ([b4040bb](https://github.com/DTStack/monaco-sql-languages/commit/b4040bbd7bd9563af6df491f3b83bb3748cd328f))
* upgrade dt-sql-parser ([#125](https://github.com/DTStack/monaco-sql-languages/issues/125)) ([bcdef98](https://github.com/DTStack/monaco-sql-languages/commit/bcdef98541b17f0f5fbf2eb0d7a441152db0ed3b))

## [0.12.0-beta.14](https://github.com/DTStack/monaco-sql-languages/compare/v0.12.0-beta.1...v0.12.0-beta.14) (2024-04-26)


### Features

* add vscode plus colorTheme ([#65](https://github.com/DTStack/monaco-sql-languages/issues/65)) ([f7a7ea8](https://github.com/DTStack/monaco-sql-languages/commit/f7a7ea811555d6d77a1c3669552d0c92675e21cc))
* allow the monaco version to be greater than 0.31.0 ([708f38c](https://github.com/DTStack/monaco-sql-languages/commit/708f38c2ff1e6cf7f5814c252db3fc15d2aa4930))
* build languages ([#114](https://github.com/DTStack/monaco-sql-languages/issues/114)) ([f6b34e5](https://github.com/DTStack/monaco-sql-languages/commit/f6b34e5cde3540ea7af70693542e7b495ece3cb6))
* disabled commmon sql diagnostics feature ([0a64586](https://github.com/DTStack/monaco-sql-languages/commit/0a6458671f547a80f890c58db998b12ebc81c8d2))
* export "incomplete" settings in completionService ([#101](https://github.com/DTStack/monaco-sql-languages/issues/101)) ([7567b5b](https://github.com/DTStack/monaco-sql-languages/commit/7567b5be98eefb093639fb56fc234ac8434e1660))
* highlight keywords of condition expression ([#66](https://github.com/DTStack/monaco-sql-languages/issues/66)) ([a9f6578](https://github.com/DTStack/monaco-sql-languages/commit/a9f65782e6900c94db9fe42e32457965b37f5c16))
* hive and spark support code completion ([#54](https://github.com/DTStack/monaco-sql-languages/issues/54)) ([6d0eabf](https://github.com/DTStack/monaco-sql-languages/commit/6d0eabfde35929e80ca659ff554ce4d872889f8b))
* improve flinksql highlight ([#58](https://github.com/DTStack/monaco-sql-languages/issues/58)) ([c204a2c](https://github.com/DTStack/monaco-sql-languages/commit/c204a2c1d2be65b0c78df207bb3e778ff885b6c0))
* improve highlight conf ([#122](https://github.com/DTStack/monaco-sql-languages/issues/122)) ([0d14d3d](https://github.com/DTStack/monaco-sql-languages/commit/0d14d3d77b0079c461bf7580f303f016623615f0))
* improve highlighting of hive lanuguage ([#59](https://github.com/DTStack/monaco-sql-languages/issues/59)) ([43c14c8](https://github.com/DTStack/monaco-sql-languages/commit/43c14c8ba638e00ac791afda33ccb1864eee347c))
* improve highlighting of spark language ([#61](https://github.com/DTStack/monaco-sql-languages/issues/61)) ([4de9815](https://github.com/DTStack/monaco-sql-languages/commit/4de9815402956d737077d085705044c5d9bae328))
* improve highlighting of trinosql language ([#64](https://github.com/DTStack/monaco-sql-languages/issues/64)) ([f24e4ff](https://github.com/DTStack/monaco-sql-languages/commit/f24e4ffe72aa1ea88497fe000563ad4e37bf8e14))
* improve setup language features ([#113](https://github.com/DTStack/monaco-sql-languages/issues/113)) ([206b0fd](https://github.com/DTStack/monaco-sql-languages/commit/206b0fd87e77809962c1aa0a92e01c4a8b92331c))
* improve ts and export ([#112](https://github.com/DTStack/monaco-sql-languages/issues/112)) ([7fceed2](https://github.com/DTStack/monaco-sql-languages/commit/7fceed221764556e0b55b84d595109d0b585b90e))
* make language features optional ([#72](https://github.com/DTStack/monaco-sql-languages/issues/72)) ([ad49871](https://github.com/DTStack/monaco-sql-languages/commit/ad498713c96a481b6b055852c4447252c97f2f72))
* migrate ng ([#111](https://github.com/DTStack/monaco-sql-languages/issues/111)) ([7a10a6a](https://github.com/DTStack/monaco-sql-languages/commit/7a10a6ad62c367fc022c62e88e4bc119df65c3cc))
* optimize ICompletionItem type and add ICompletionList type ([#102](https://github.com/DTStack/monaco-sql-languages/issues/102)) ([00c7c6b](https://github.com/DTStack/monaco-sql-languages/commit/00c7c6ba181e85e889cb0da20fd48880676785d8))
* support  preprocess code ([#103](https://github.com/DTStack/monaco-sql-languages/issues/103)) ([51777c6](https://github.com/DTStack/monaco-sql-languages/commit/51777c6cc33594673f540d5b695a2928c994c70c))
* support impala ([#83](https://github.com/DTStack/monaco-sql-languages/issues/83)) ([16934be](https://github.com/DTStack/monaco-sql-languages/commit/16934bec568bfd902a9cc3f06b336fb56b557561))
* support mysql ([#85](https://github.com/DTStack/monaco-sql-languages/issues/85)) ([4e7d9d4](https://github.com/DTStack/monaco-sql-languages/commit/4e7d9d462d45480e4a819c1894c2685c42e99248))
* support trinosql language ([#56](https://github.com/DTStack/monaco-sql-languages/issues/56)) ([adbd3df](https://github.com/DTStack/monaco-sql-languages/commit/adbd3df957d6cb3c3e7e9e7cb8a879a6b62699ad))
* update lock file ([8f6ae1c](https://github.com/DTStack/monaco-sql-languages/commit/8f6ae1c20db2caaa4d570c680e7d939784ed48ad))
* update sql parser ([#82](https://github.com/DTStack/monaco-sql-languages/issues/82)) ([2cad6b3](https://github.com/DTStack/monaco-sql-languages/commit/2cad6b30ab447cba2ee6c98ffe94e706356d8aa1))
* upgrade dt-sql-parser ([59e8078](https://github.com/DTStack/monaco-sql-languages/commit/59e807861d8d98f97ef1763ae7ade670bc3edacf))
* upgrade dt-sql-parser ([#120](https://github.com/DTStack/monaco-sql-languages/issues/120)) ([7fca45e](https://github.com/DTStack/monaco-sql-languages/commit/7fca45ed440753fefec0d85f8f04312d01c6564a))
* upgrade dt-sql-parser to v4.0.0-beta.4.11 ([4d680f4](https://github.com/DTStack/monaco-sql-languages/commit/4d680f41022f8ebcf8fe5d3acc7093a4a2f29f62))
* upgrade dt-sql-parser to v4.0.0-beta.4.5 ([23b90fe](https://github.com/DTStack/monaco-sql-languages/commit/23b90fe1e23b2d0b29fe376e946e8a774578d37e))
* upgrade dt-sql-parser to v4.0.0-beta.4.6 ([f79285c](https://github.com/DTStack/monaco-sql-languages/commit/f79285c8eaeca40676de33e0246b6b71ec71cc19))
* upgrade dt-sql-parser to v4.0.0-beta.4.7 ([a1caa33](https://github.com/DTStack/monaco-sql-languages/commit/a1caa33b8e5a05a4307e44c9fc805086fee388b4))
* upgrade dt-sql-parser to v4.0.0-beta.4.9 ([#90](https://github.com/DTStack/monaco-sql-languages/issues/90)) ([c354c52](https://github.com/DTStack/monaco-sql-languages/commit/c354c523d029ad482615dbaae270b3d88faf7696))


### Bug Fixes

* [#117](https://github.com/DTStack/monaco-sql-languages/issues/117) sql brackets `{` ([#118](https://github.com/DTStack/monaco-sql-languages/issues/118)) ([5d5741c](https://github.com/DTStack/monaco-sql-languages/commit/5d5741cb5dd987760a96113fc127e768071464ab))
* [#121](https://github.com/DTStack/monaco-sql-languages/issues/121) customParams use identifier highlight ([#123](https://github.com/DTStack/monaco-sql-languages/issues/123)) ([ea22ff0](https://github.com/DTStack/monaco-sql-languages/commit/ea22ff07611943014fd6bdedf17b760293afda61))
* correct diag position ([#49](https://github.com/DTStack/monaco-sql-languages/issues/49)) ([560e05b](https://github.com/DTStack/monaco-sql-languages/commit/560e05b0a5b1f9d84f54e9f25b825441f193d33c))
* correct main field in package.json ([0f70a6e](https://github.com/DTStack/monaco-sql-languages/commit/0f70a6ed2cc373994fbea9c7f369b08f9c1b5625))
* trino/hive keywords exclude nonReserved ([#88](https://github.com/DTStack/monaco-sql-languages/issues/88)) ([d9a7447](https://github.com/DTStack/monaco-sql-languages/commit/d9a74470fd7893da18d2844fd371cf0058b19533))

## [0.12.0-beta.13](https://github.com/DTStack/monaco-sql-languages/compare/v0.12.0-beta.12...v0.12.0-beta.13) (2024-04-22)


### Features

* improve highlight conf ([#122](https://github.com/DTStack/monaco-sql-languages/issues/122)) ([0d14d3d](https://github.com/DTStack/monaco-sql-languages/commit/0d14d3d77b0079c461bf7580f303f016623615f0))


### Bug Fixes

* [#121](https://github.com/DTStack/monaco-sql-languages/issues/121) customParams use identifier highlight ([#123](https://github.com/DTStack/monaco-sql-languages/issues/123)) ([ea22ff0](https://github.com/DTStack/monaco-sql-languages/commit/ea22ff07611943014fd6bdedf17b760293afda61))

## [0.12.0-beta.12](https://github.com/DTStack/monaco-sql-languages/compare/v0.12.0-beta.11...v0.12.0-beta.12) (2024-04-19)


### Features

* upgrade dt-sql-parser ([#120](https://github.com/DTStack/monaco-sql-languages/issues/120)) ([7fca45e](https://github.com/DTStack/monaco-sql-languages/commit/7fca45ed440753fefec0d85f8f04312d01c6564a))


### Bug Fixes

* [#117](https://github.com/DTStack/monaco-sql-languages/issues/117) sql brackets `{` ([#118](https://github.com/DTStack/monaco-sql-languages/issues/118)) ([5d5741c](https://github.com/DTStack/monaco-sql-languages/commit/5d5741cb5dd987760a96113fc127e768071464ab))

## [0.12.0-beta.11](https://github.com/DTStack/monaco-sql-languages/compare/v0.12.0-beta.10...v0.12.0-beta.11) (2024-04-01)


### Features

* build languages ([#114](https://github.com/DTStack/monaco-sql-languages/issues/114)) ([f6b34e5](https://github.com/DTStack/monaco-sql-languages/commit/f6b34e5cde3540ea7af70693542e7b495ece3cb6))
* export "incomplete" settings in completionService ([#101](https://github.com/DTStack/monaco-sql-languages/issues/101)) ([7567b5b](https://github.com/DTStack/monaco-sql-languages/commit/7567b5be98eefb093639fb56fc234ac8434e1660))
* improve setup language features ([#113](https://github.com/DTStack/monaco-sql-languages/issues/113)) ([206b0fd](https://github.com/DTStack/monaco-sql-languages/commit/206b0fd87e77809962c1aa0a92e01c4a8b92331c))
* improve ts and export ([#112](https://github.com/DTStack/monaco-sql-languages/issues/112)) ([7fceed2](https://github.com/DTStack/monaco-sql-languages/commit/7fceed221764556e0b55b84d595109d0b585b90e))
* migrate ng ([#111](https://github.com/DTStack/monaco-sql-languages/issues/111)) ([7a10a6a](https://github.com/DTStack/monaco-sql-languages/commit/7a10a6ad62c367fc022c62e88e4bc119df65c3cc))
* optimize ICompletionItem type and add ICompletionList type ([#102](https://github.com/DTStack/monaco-sql-languages/issues/102)) ([00c7c6b](https://github.com/DTStack/monaco-sql-languages/commit/00c7c6ba181e85e889cb0da20fd48880676785d8))
* support  preprocess code ([#103](https://github.com/DTStack/monaco-sql-languages/issues/103)) ([51777c6](https://github.com/DTStack/monaco-sql-languages/commit/51777c6cc33594673f540d5b695a2928c994c70c))

## [0.12.0-beta.10](https://github.com/DTStack/monaco-sql-languages/compare/v0.12.0-beta.9...v0.12.0-beta.10) (2024-01-04)


### Features

* disabled commmon sql diagnostics feature ([0a64586](https://github.com/DTStack/monaco-sql-languages/commit/0a6458671f547a80f890c58db998b12ebc81c8d2))
* upgrade dt-sql-parser to v4.0.0-beta.4.11 ([4d680f4](https://github.com/DTStack/monaco-sql-languages/commit/4d680f41022f8ebcf8fe5d3acc7093a4a2f29f62))

## [0.12.0-beta.9](https://github.com/DTStack/monaco-sql-languages/compare/v0.12.0-beta.8...v0.12.0-beta.9) (2023-12-15)


### Features

* allow the monaco version to be greater than 0.31.0 ([708f38c](https://github.com/DTStack/monaco-sql-languages/commit/708f38c2ff1e6cf7f5814c252db3fc15d2aa4930))
* update lock file ([8f6ae1c](https://github.com/DTStack/monaco-sql-languages/commit/8f6ae1c20db2caaa4d570c680e7d939784ed48ad))

## [0.12.0-beta.8](https://github.com/DTStack/monaco-sql-languages/compare/v0.12.0-beta.7...v0.12.0-beta.8) (2023-12-15)


### Features

* support impala ([#83](https://github.com/DTStack/monaco-sql-languages/issues/83)) ([16934be](https://github.com/DTStack/monaco-sql-languages/commit/16934bec568bfd902a9cc3f06b336fb56b557561))
* support mysql ([#85](https://github.com/DTStack/monaco-sql-languages/issues/85)) ([4e7d9d4](https://github.com/DTStack/monaco-sql-languages/commit/4e7d9d462d45480e4a819c1894c2685c42e99248))
* update sql parser ([#82](https://github.com/DTStack/monaco-sql-languages/issues/82)) ([2cad6b3](https://github.com/DTStack/monaco-sql-languages/commit/2cad6b30ab447cba2ee6c98ffe94e706356d8aa1))
* upgrade dt-sql-parser to v4.0.0-beta.4.9 ([#90](https://github.com/DTStack/monaco-sql-languages/issues/90)) ([c354c52](https://github.com/DTStack/monaco-sql-languages/commit/c354c523d029ad482615dbaae270b3d88faf7696))


### Bug Fixes

* trino/hive keywords exclude nonReserved ([#88](https://github.com/DTStack/monaco-sql-languages/issues/88)) ([d9a7447](https://github.com/DTStack/monaco-sql-languages/commit/d9a74470fd7893da18d2844fd371cf0058b19533))

## [0.12.0-beta.7](https://github.com/DTStack/monaco-sql-languages/compare/v0.12.0-beta.6...v0.12.0-beta.7) (2023-11-24)


### Features

* upgrade dt-sql-parser to v4.0.0-beta.4.7 ([a1caa33](https://github.com/DTStack/monaco-sql-languages/commit/a1caa33b8e5a05a4307e44c9fc805086fee388b4))

## [0.12.0-beta.6](https://github.com/DTStack/monaco-sql-languages/compare/v0.12.0-beta.5...v0.12.0-beta.6) (2023-11-20)


### Features

* upgrade dt-sql-parser to v4.0.0-beta.4.6 ([f79285c](https://github.com/DTStack/monaco-sql-languages/commit/f79285c8eaeca40676de33e0246b6b71ec71cc19))

## [0.12.0-beta.5](https://github.com/DTStack/monaco-sql-languages/compare/v0.12.0-beta.4...v0.12.0-beta.5) (2023-11-10)


### Features

* make language features optional ([#72](https://github.com/DTStack/monaco-sql-languages/issues/72)) ([ad49871](https://github.com/DTStack/monaco-sql-languages/commit/ad498713c96a481b6b055852c4447252c97f2f72))

## [0.12.0-beta.4](https://github.com/DTStack/monaco-sql-languages/compare/v0.12.0-beta.3...v0.12.0-beta.4) (2023-11-07)


### Features

* upgrade dt-sql-parser to v4.0.0-beta.4.5 ([23b90fe](https://github.com/DTStack/monaco-sql-languages/commit/23b90fe1e23b2d0b29fe376e946e8a774578d37e))

## [0.12.0-beta.3](https://github.com/DTStack/monaco-sql-languages/compare/v0.12.0-beta.1...v0.12.0-beta.3) (2023-11-06)


### Features

* add vscode plus colorTheme ([#65](https://github.com/DTStack/monaco-sql-languages/issues/65)) ([f7a7ea8](https://github.com/DTStack/monaco-sql-languages/commit/f7a7ea811555d6d77a1c3669552d0c92675e21cc))
* highlight keywords of condition expression ([#66](https://github.com/DTStack/monaco-sql-languages/issues/66)) ([a9f6578](https://github.com/DTStack/monaco-sql-languages/commit/a9f65782e6900c94db9fe42e32457965b37f5c16))
* hive and spark support code completion ([#54](https://github.com/DTStack/monaco-sql-languages/issues/54)) ([6d0eabf](https://github.com/DTStack/monaco-sql-languages/commit/6d0eabfde35929e80ca659ff554ce4d872889f8b))
* improve flinksql highlight ([#58](https://github.com/DTStack/monaco-sql-languages/issues/58)) ([c204a2c](https://github.com/DTStack/monaco-sql-languages/commit/c204a2c1d2be65b0c78df207bb3e778ff885b6c0))
* improve highlighting of hive lanuguage ([#59](https://github.com/DTStack/monaco-sql-languages/issues/59)) ([43c14c8](https://github.com/DTStack/monaco-sql-languages/commit/43c14c8ba638e00ac791afda33ccb1864eee347c))
* improve highlighting of spark language ([#61](https://github.com/DTStack/monaco-sql-languages/issues/61)) ([4de9815](https://github.com/DTStack/monaco-sql-languages/commit/4de9815402956d737077d085705044c5d9bae328))
* improve highlighting of trinosql language ([#64](https://github.com/DTStack/monaco-sql-languages/issues/64)) ([f24e4ff](https://github.com/DTStack/monaco-sql-languages/commit/f24e4ffe72aa1ea88497fe000563ad4e37bf8e14))
* support trinosql language ([#56](https://github.com/DTStack/monaco-sql-languages/issues/56)) ([adbd3df](https://github.com/DTStack/monaco-sql-languages/commit/adbd3df957d6cb3c3e7e9e7cb8a879a6b62699ad))


### Bug Fixes

* correct diag position ([#49](https://github.com/DTStack/monaco-sql-languages/issues/49)) ([560e05b](https://github.com/DTStack/monaco-sql-languages/commit/560e05b0a5b1f9d84f54e9f25b825441f193d33c))
* correct main field in package.json ([0f70a6e](https://github.com/DTStack/monaco-sql-languages/commit/0f70a6ed2cc373994fbea9c7f369b08f9c1b5625))

## [0.12.0-beta.2](https://github.com/DTStack/monaco-sql-languages/compare/v0.12.0-beta.1...v0.12.0-beta.2) (2023-09-01)


### Features

* upgrade dt-sql-parser to v4.0.0-beta.4.2 ([2a11750](https://github.com/DTStack/monaco-sql-languages/commit/2a117505477b84796098fbf8b21990f9973d214e))


### Bug Fixes

* correct diag position ([#49](https://github.com/DTStack/monaco-sql-languages/issues/49)) ([560e05b](https://github.com/DTStack/monaco-sql-languages/commit/560e05b0a5b1f9d84f54e9f25b825441f193d33c))
* correct main field in package.json ([0f70a6e](https://github.com/DTStack/monaco-sql-languages/commit/0f70a6ed2cc373994fbea9c7f369b08f9c1b5625))
* correct module field in package.json ([83880a2](https://github.com/DTStack/monaco-sql-languages/commit/83880a2e631d99509c0c965ce234e65591731a62))

## [0.12.0-beta.1](https://github.com/DTStack/monaco-sql-languages/compare/v0.12.0-beta...v0.12.0-beta.1) (2023-06-14)

## [0.12.0-beta](https://github.com/DTStack/monaco-sql-languages/compare/v0.11.0...v0.12.0-beta) (2023-06-14)

### Features

-   allow flink sql language register completionService ([520a02e](https://github.com/DTStack/monaco-sql-languages/commit/520a02e2723acc57a6c57c35e5821ae93864ce2d))
-   flinksql completion ([1fba38b](https://github.com/DTStack/monaco-sql-languages/commit/1fba38be58201ed2b842d61f419a4400d05fa2d8))
-   integrated dt-sql-parser auto complete ([c0d5ecf](https://github.com/DTStack/monaco-sql-languages/commit/c0d5ecfe95e3041cb9c6cfd229fbe4f5856b610a))
-   remove lstypes about because it is for node-lsp ([3b5c06e](https://github.com/DTStack/monaco-sql-languages/commit/3b5c06e8d664894ee0d93f25b69c9202c263cbda))
-   support syntax completions ([7e00463](https://github.com/DTStack/monaco-sql-languages/commit/7e004638db21276b9d8aaa98df0436c7d01e7b56))

### Bug Fixes

-   update imports ([5c7c8eb](https://github.com/DTStack/monaco-sql-languages/commit/5c7c8eb60406f0890a92acdd731be7fcefc64784))
-   upgrade react to 18 ([13fdcbb](https://github.com/DTStack/monaco-sql-languages/commit/13fdcbbd0075e2ce9e46232bbee2cd700b82a84d))

## [0.11.0](https://github.com/DTStack/monaco-sql-languages/compare/v0.10.0...v0.11.0) (2023-01-09)

### Features

-   upgrade the molecule to latest version ([377590d](https://github.com/DTStack/monaco-sql-languages/commit/377590d7fb7ae2b1c167781ec86b5ca2ad581ebe))

## [0.10.0](https://github.com/DTStack/monaco-sql-languages/compare/v0.9.5...v0.10.0) (2022-12-16)

### [0.9.5](https://github.com/DTStack/monaco-sql-languages/compare/v0.9.4...v0.9.5) (2022-08-19)

### [0.9.4](https://github.com/DTStack/monaco-sql-languages/compare/v0.9.3...v0.9.4) (2021-12-08)
