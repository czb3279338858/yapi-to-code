# 安装
```
npm install -D yapi-to-code
```

# 使用
## 配置文件
- [中文示例](https://github.com/czb3279338858/yapi-to-code/blob/main/yapi-to-code.config.cjs)


## 命令行模式
```
// package.json

...
script:{
    'yapi-to-code':'yapi-to-code -p src/yapi-to-code.config.cjs -w append -i 94306 89455'
}
...

```

## 代码模式
```
import { getConfig, yapiToCode } from 'yapi-to-code'
/**
 * 所有参数都是可选的 configPath 默认为 ./yapi-to-code.config.cjs
 */
const config = getConfig({
  ids: [94306],
  configPath: ['src/yapi-to-code.config.js'],
  writeMode: ['append']
})
yapiToCode({ config })

```

# 其他
## 项目token
![alt text](https://github.com/czb3279338858/yapi-to-code/blob/main/readme/project-token.png)

## 菜单id
![alt text](https://github.com/czb3279338858/yapi-to-code/blob/main/readme/menu-id.png)


## 接口id
![alt text](https://github.com/czb3279338858/yapi-to-code/blob/main/readme/request-id.png)
