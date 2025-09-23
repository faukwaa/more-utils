import { cloneDeep } from 'lodash-es'
import type { TreeNode, TreeOptions } from '../types'
import { genFieldNames } from '../utils'

export function summaryTree<T = any>(
  tree: T[],
  {
    fieldNames = {},
    summaryFields = [],
    deep = false,
  }: Pick<TreeOptions, 'fieldNames' | 'summaryFields' | 'deep'> = {},
): TreeNode<T>[] {
  const _fieldNames = genFieldNames(fieldNames)
  const { id, children } = _fieldNames

  // 对原始数据进行深拷贝
  const clonedTreeData = deep ? cloneDeep(tree) : [...tree]

  // 初始化一个栈，存储需要处理的节点，增加一个处理标志位
  const stack: { node: TreeNode<T>, visited: boolean }[] = clonedTreeData.map((node: any) => ({
    node,
    visited: false,
  }))

  // 初始化汇总值容器，使用节点的 id 作为键
  const totalsMap: Map<number, any> = new Map()

  // 非递归地处理每个节点，使用栈
  while (stack.length > 0) {
    const currentItem = stack[stack.length - 1] // 获取栈顶元素
    const currentNode: any = currentItem.node

    // 如果已经访问过子节点，则开始汇总
    if (currentItem.visited) {
      // 初始化当前节点的汇总值，将汇总值初始为 0
      const totals: Record<string, number> = {}
      summaryFields.forEach((field) => {
        totals[field] = 0 // 初始化为 0，忽略当前节点的字段值
      })

      // 汇总所有子节点的字段值
      if (currentNode[children] && currentNode[children].length > 0) {
        currentNode[children].forEach((child: TreeNode<T>) => {
          const childTotals = totalsMap.get(child[id])
          summaryFields.forEach((field) => {
            totals[field] += childTotals ? childTotals[field] : 0 // 汇总子节点的字段值
          })
        })
      }
      else {
        // 如果没有子节点，这是叶子节点，保留当前节点的值
        summaryFields.forEach((field) => {
          totals[field] = Number(currentNode[field]) || 0
        })
      }

      // 将当前节点的汇总结果保存到 Map 中，使用节点的 id 作为键
      totalsMap.set(currentNode[id], totals)

      // 将汇总值赋回到当前节点
      summaryFields.forEach((field) => {
        currentNode[field] = totals[field]
      })

      // 从栈中移除当前节点
      stack.pop()
    }
    else {
      // 如果还没有访问子节点，将子节点推入栈
      currentItem.visited = true
      if (currentNode[children] && currentNode[children].length > 0) {
        currentNode[children].forEach((child: TreeNode<T>) => {
          stack.push({ node: child, visited: false })
        })
      }
    }
  }

  return clonedTreeData as TreeNode<T>[]
}
