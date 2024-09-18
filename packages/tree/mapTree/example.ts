import { executeWithProgressBar } from '../utils'
import { mapTree } from '.'

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
        amount: 20,
        children: [{ id: 44, name: 'D', amount: 20 }],
      },
      { id: 33, name: 'C', amount: 30 },
    ],
  },
]
executeWithProgressBar(() => new Promise<void>((resolve) => {
  const _tree = mapTree(treeData as any, item => ({ id: item.id, name: item.name, amount: item.amount * 2 }), { deep: false })
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(treeData, null, 2), JSON.stringify(_tree, null, 2))
  resolve()
}))
