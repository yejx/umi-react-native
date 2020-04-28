# umi-react-native

[umi](https://umijs.org/) preset plugins for react-native.

## 目录

- [必备](#%E5%BF%85%E5%A4%87)
- [安装](#%E5%AE%89%E8%A3%85)
- [使用](#%E4%BD%BF%E7%94%A8)
  - [配置 umi](#%E9%85%8D%E7%BD%AE-umi)
  - [开发](#%E5%BC%80%E5%8F%91)
  - [构建离线包（offline bundle）](#%E6%9E%84%E5%BB%BA%E7%A6%BB%E7%BA%BF%E5%8C%85offline-bundle)

## 必备

- RN 工程（已有，或使用`react-native init`新建）；
- 全局 或 RN 工程本地（内部）安装 umi 3.0 及以上版本。

## 安装

在 RN 工程内部安装：

```npm
yarn add umi-preset-react-native --dev
```

**注意：** 以下是`umi-preset-react-native`对 Node、react、react-native、umi 版本的要求：

```json
{
  "name": "umi-preset-react-native",
  "engines": {
    "node": ">=10.x"
  },
  "peerDependencies": {
    "react": "^16.8.3",
    "react-native": ">=0.59.0 <1.0.x",
    "umi": "^3.0.0"
  }
}
```

## 使用

### 配置 umi

```javascript
// .umirc.js
export default {
  history: {
    type: 'memory',
  },
};
```

**注意：**

- `history`配置项：在 RN 中只能使用：`'memory'`类型，[umi](https://umijs.org/) 默认值是：`'browser'`。`'browser'`和`'hash'`类型都需要 DOM，在 RN 中会报错；

**在 RN 中集成其他[umi](https://umijs.org/)插件需要开发者自行斟酌。**

[umi](https://umijs.org/)插件包括：

- 内建插件：[@umijs/preset-built-in](https://github.com/umijs/umi/tree/master/packages/preset-built-in)，这一部分是无法拆除的。
- 额外扩展插件：[@umijs/plugins](https://github.com/umijs/plugins)

_与 DOM 无关的[umi](https://umijs.org/)插件都是可以使用的，或者说支持服务端渲染的插件基本也是可以在 RN 运行环境中使用的。_

### 开发

修改`package.json`文件，使用`umi-rn`取代`react-native`：

```diff
{
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
-   "start": "react-native start",
+   "start": "umi dev-rn",
  },
}
```

执行`yarn start`之后，再使用 `yarn android` 或者 `yarn ios`。

### 构建离线包（offline bundle）

```shell
umi build-rn --platform <ios|android>
```
