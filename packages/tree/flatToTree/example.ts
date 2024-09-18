import { executeWithProgressBar, generateFlatTreeData } from '../utils'
import { treeToFlat } from '../treeToFlat'
import { flatToTree } from '.'

const flatData = generateFlatTreeData(2, 2)

executeWithProgressBar(() => new Promise((resolve) => {
  const data = flatToTree(treeToFlat(flatData))
  resolve(data)
}))
