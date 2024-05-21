import { treeToFlat } from '.'

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
            name: '3',
          },
        ],
      },
    ],
  },
]

// eslint-disable-next-line no-console
console.log(JSON.stringify(treeToFlat(tree)))
