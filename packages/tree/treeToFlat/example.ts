import { executeWithProgressBar, generateTreeData } from '../utils'
import { treeToFlat } from '.'

const tree = generateTreeData(3, 2)
executeWithProgressBar(() => new Promise<void>((resolve) => {
  const flat = treeToFlat(tree as any, { hasChildren: true })
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(tree, null, 2), JSON.stringify(flat, null, 2))
  resolve()
}))
