import { executeWithProgressBar } from '../utils'
import { replaceTree } from '.'

// 示例数据
const treeData: any = [
  {
    id: '1',
    name: 'Node 1',
    children: [
      {
        id: '1-1',
        name: 'Node 1-1',
        children: [],
      },
      {
        id: '1-2',
        name: 'Node 1-2',
        children: [
          {
            id: '1-2-1',
            name: 'Node 1-2-1',
          },
        ],
      },
    ],
  },
]

// 新的节点数据
const newNode: any = {
  id: '1-2',
  name: 'Updated Node 1-2',
  value: 100,
}

executeWithProgressBar(() => new Promise<void>((resolve) => {
  const updatedTree = replaceTree(
    treeData,
    newNode,
    node => node.id === '1-2', // 自定义的替换条件
    {
      fieldNames: { id: 'id', children: 'children' }, // 自定义字段名
    },
  )
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(updatedTree, null, 2))
  resolve()
}))
