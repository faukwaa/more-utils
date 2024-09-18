import { executeWithProgressBar } from '../utils'
import { genTreeAttrs } from '.'

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
  genTreeAttrs(treeData as any)
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(treeData, null, 2))
  resolve()
}))
