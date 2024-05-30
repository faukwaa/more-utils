## 📦 Install

### ALL Utils

```bash
npm i more-utils-all
```

### Tree

```bash
npm i more-utils-tree
```

## 🦄 Usage

### flatToTree

```ts
import { flatToTree } from 'more-utils-tree'

const flat = [
  { id: 1, name: '1' },
  { id: 2, name: '2', parentId: 1 },
  { id: 3, name: '3', parentId: 2 }
]

const tree = flatToTree(flat)

// tree:
// [
//   {
//     children: [
//       {
//         children: [
//            ...
//         ],
//         id: 2,
//         name: '2',
//         parentId: 1,
//         parentIds: [1],
//         parent: {
//           id: 1,
//           name: '1',
//           parentId: null,
//           parentIds: [],
//           depth: 0,
//           path: '1',
//           isLeaf: false
//         },
//         depth: 1,
//         path: '1/2',
//         isLeaf: false
//       }],
//     id: 1,
//     name: '1',
//     parentId: null,
//     parentIds: [],
//     depth: 0,
//     path: '1',
//     isLeaf: false
//   }
// ]
```

### treeToFlat

```ts
const tree = [
  {
    id: 1,
    name: '1',
    children: [
      {
        id: 2,
        name: '2',
        children: [
          {
            id: 3,
            name: '3'
          }
        ]
      }
    ]
  }
]

const flat = treeToFlat(tree)

// flat:
// [
//   {
//     id: 1, name: '1', parentId: null, parentIds: [], depth: 0, path: '1', isLeaf: false
//   },
//   {
//     id: 2, name: '2', parentId: 1, parentIds: [1],
//     parent: { id: 1, name: '1', parentId: null, parentIds: [], depth: 0, path: '1', isLeaf: false }, depth: 1, path: '1/2', isLeaf: false
//   },
//   ...
// ]
```

## 🐼 More Tree Utils

### pathToTree

### filterTree

### eachTree

### findTree

### findIndexTree

### mapTree

### replaceTree

### genTreeAttrs

### Color

```bash
npm i more-utils-color
```

### Format

```bash
npm i more-utils-format
```
