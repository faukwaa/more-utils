import { executeWithProgressBar } from '../utils'
import { findTree } from '.'

const treeData = [
  {
    id: 1,
    name: 'A',
    amount: 100,
    children: [
      {
        id: 2,
        name: 'B',
        amount: 20,
        children: [{ id: 4, name: 'D', amount: 20 }],
      },
      { id: 3, name: 'C', amount: 30 },
    ],
  },
]
executeWithProgressBar(() => new Promise<void>((resolve) => {
  const node = findTree(treeData as any, item => item.amount === 20)
  // eslint-disable-next-line no-console
  console.log(node)
  resolve()
}))
