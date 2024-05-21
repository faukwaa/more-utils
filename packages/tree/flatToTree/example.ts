import { flatToTree } from '.'

const flat = [
  { id: 3, name: '3', parentId: 2 },
  { id: 1, name: '1' },
  { id: 2, name: '2', parentId: 1 },
]

const tree = flatToTree(flat)

// eslint-disable-next-line no-console
console.log(JSON.stringify(tree))

// [
//   {
//     children: [
//       {
//         children: [
//           {
//             children: [],
//             id: 3,
//             name: '3',
//             parentId: 2,
//             parentIds: [1, 2],
//             parent: {
//               id: 2,
//               name: '2',
//               parentId: 1,
//               parentIds: [1],
//               parent: { id: 1, name: '1', parentId: null, parentIds: [], depth: 0, path: '1', isLeaf: false },
//               depth: 1,
//               path: '1/2',
//               isLeaf: false
//             },
//             depth: 2,
//             path: '1/2/3',
//             isLeaf: true
//           }
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
