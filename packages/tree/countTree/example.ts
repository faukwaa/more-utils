import { executeWithProgressBar } from '../utils'
import { countTree } from '.'

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
  {
    id: 11,
    name: 'A',
    amount: 100,
    children: [
      {
        id: 22,
        name: 'B',
        amount: 50,
        children: [{ id: 44, name: 'D', amount: 20 }],
      },
      { id: 33, name: 'C', amount: 30 },
    ],
  },
]
executeWithProgressBar(() => new Promise<void>((resolve) => {
  const _tree = countTree(treeData as any, item => item.amount > 20, { fieldNames: { count: 'count1' } })
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(treeData, null, 2), JSON.stringify(_tree, null, 2))
  resolve()
}))
