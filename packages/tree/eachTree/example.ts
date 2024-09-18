import { executeWithProgressBar } from '../utils'
import { eachTree } from '.'

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
]
executeWithProgressBar(() => new Promise<void>((resolve) => {
  eachTree(treeData as any, item => item.name = item.name + item.id)
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(treeData, null, 2))
  resolve()
}))
