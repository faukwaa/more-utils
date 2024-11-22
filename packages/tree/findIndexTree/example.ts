import { executeWithProgressBar } from '../utils'
import { findIndexTree } from '.'

const treeData = [
  {
    id: 1,
    name: 'A',
    amount: 100,
    children: [
      {
        id: 2,
        name: 'B',
        amount: 50,
        children: [{ id: 4, name: 'D', amount: 20 }],
      },
      { id: 3, name: 'C', amount: 30 },
    ],
  },
  { id: 5, name: 'E', amount: 20 },
]
executeWithProgressBar(() => new Promise<void>((resolve) => {
  const index = findIndexTree(treeData as any, item => item.amount === 20)
  // eslint-disable-next-line no-console
  console.log(index)
  resolve()
}))
