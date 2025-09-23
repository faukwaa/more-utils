import { cloneDeep } from 'lodash-es'
import type { TreeNode, TreeOptions } from '../types'
import { genFieldNames } from '../utils'

export function countTree<T = any>(
  tree: T[],
  callback: (node: T) => boolean,
  { fieldNames = {}, deep = false }: Pick<TreeOptions, 'fieldNames' | 'deep'> = {},
) {
  const _fieldNames = genFieldNames(fieldNames)
  const { children, count: countKey } = _fieldNames
  const clonedTreeData = deep ? cloneDeep(tree) : [...tree]
  const stack: { node: TreeNode<T>, pendingChildren?: boolean }[] = clonedTreeData.map((node: any) => ({ node, pendingChildren: true }))

  // 存储每个节点的符合条件的子孙节点数量
  const descendantCounts = new Map<TreeNode<T>, number>()

  while (stack.length > 0) {
    const { node, pendingChildren } = stack[stack.length - 1]

    if (pendingChildren) {
      // 标记子节点还未处理
      stack[stack.length - 1].pendingChildren = false

      // 如果当前节点有子节点，先将子节点推入栈中处理
      const nodeChildren = node[children]
      if (nodeChildren && nodeChildren.length > 0) {
        for (let i = nodeChildren.length - 1; i >= 0; i--)
          stack.push({ node: nodeChildren[i], pendingChildren: true })
      }
    }
    else {
      // 子节点已经处理完毕，统计当前节点的符合条件的子孙节点数量
      stack.pop()

      let count = 0

      // 计算当前节点直接子节点的数量
      const nodeChildren = node[children]
      if (nodeChildren && nodeChildren.length > 0) {
        for (const child of nodeChildren) {
          count += descendantCounts.get(child) || 0 // 加上子节点的子孙节点数量
          if (callback(child))
            count++ // 如果子节点符合条件，计数加一
        }
      }

      // 将计算出的数量存储在当前节点上
      (node as any)[countKey] = count
      descendantCounts.set(node, count)
    }
  }
  return clonedTreeData
}
