import { flatToTree } from 'more-utils-tree'

const flat = [
  { id: 3, name: '3', parentId: 2 },
  { id: 1, name: '1' },
  { id: 2, name: '2', parentId: 1 },
]

const tree = flatToTree(flat)

// eslint-disable-next-line no-console
console.log(JSON.stringify(tree))
