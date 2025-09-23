/* eslint-disable jsdoc/check-param-names */
import { cloneDeep } from 'lodash-es'
import type { TreeOptions } from '../types'
import { genFieldNames } from '../utils'

/**
 * 遍历树形节点,返回新数组
 * @param tree 树形数据
 * @param callback 遍历函数
 * @param param2 配置项
 * @param param2.fieldNames 字段名
 * @param param2.fieldNames.id id 字段名，默认为 'id'
 * @param param2.fieldNames.name 名称字段名，默认为 'name'
 * @param param2.fieldNames.parentId 父级 id 字段名，默认为 'parentId'
 * @param param2.fieldNames.parentIds 父级 id 路径字段名，默认为 'parentIds'
 * @param param2.fieldNames.parent 父级字段名，默认为 'parent'
 * @param param2.fieldNames.children 子级字段名，默认为 'children'
 * @param param2.fieldNames.depth 深度字段名，默认为 'depth'
 * @param param2.fieldNames.path 路径字段名，默认为 'path'
 * @param param2.fieldNames.isLeaf 是否为叶子节点字段名，默认为 'isLeaf'
 * @param param2.flat 是否扁平化，默认为 false
 * @param param2.hasEmptyChildren 是否为每个节点添加一个空的 children 字段，默认为 false
 * @returns 遍历后的树形数据
 */
export function mapTree<T = any, R = any>(
  tree: T[],
  callback: (node: T) => R,
  { fieldNames = {}, deep = true }: Pick<TreeOptions, 'fieldNames' | 'deep'> = {},
): R[] {
  const _fieldNames = genFieldNames(fieldNames)
  const { children } = _fieldNames
  const clonedTreeData = deep ? cloneDeep(tree) : [...tree]

  // 使用栈来进行迭代遍历，这里使用 reverse() 来确保根节点按顺序入栈
  const stack: { node: T, parent: R | null }[] = clonedTreeData
    .slice() // 使用 slice 创建 tree 的浅拷贝，避免修改原数组
    .reverse() // 反转根节点顺序
    .map((node: any) => ({ node, parent: null }))

  const newTree: R[] = []

  while (stack.length > 0) {
    const { node, parent } = stack.pop()!
    const newNode = callback(node)

    // 将新节点添加到父节点的子节点数组中
    if (parent)
      (parent as any)[children].push(newNode)
    else
      newTree.push(newNode) // 根节点放入新树中

    // 如果当前节点有子节点，继续处理子节点
    const nodeChildren = (node as Record<string, any>)[children]
    if (nodeChildren && nodeChildren.length > 0) {
      (newNode as any)[children] = []

      // 子节点入栈时反转顺序，确保从左到右处理
      stack.push(
        ...nodeChildren
          .slice() // 创建子节点的浅拷贝
          .reverse() // 反转子节点顺序
          .map((childNode: any) => ({ node: childNode, parent: newNode })),
      )
    }
  }

  return newTree
}
