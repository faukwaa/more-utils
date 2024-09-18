import { executeWithProgressBar } from '../utils'
import { pathToTree } from '.'

const data = [
  { path: '/A/B/C', value: 1 },
  { path: '/A/B/D', value: 2 },
  { path: '/A/E', value: 3 },
  { path: '/F', value: 4 },
]

executeWithProgressBar(() => new Promise<void>((resolve) => {
  const _tree = pathToTree(data as any)
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(_tree, null, 2))
  resolve()
}))
