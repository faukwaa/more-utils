import { executeWithProgressBar } from '../utils'
import { filterTree } from '.'

const treeData = [
  {
    id: '1',
    name: 'Node 1',
    amount: 10,
    children: [
      {
        id: '1-1',
        name: 'Node 1-1',
        amount: 10,
        children: [],
      },
      {
        id: '1-2',
        name: 'Node 1-2',
        amount: 30,
        children: [
          {
            id: '1-2-1',
            name: 'Node 1-2-1',
            amount: 15,
          },
        ],
      },
    ],
  },
]
executeWithProgressBar(() => new Promise<void>((resolve) => {
  const _tree = filterTree(treeData as any, item => item.amount > 10, { hasChildren: true })
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(_tree, null, 2))
  resolve()
}))
