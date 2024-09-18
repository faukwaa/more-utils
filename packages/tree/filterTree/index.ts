/* eslint-disable jsdoc/check-param-names */
import { cloneDeep } from 'lodash-es'
import type { TreeOptions } from '../types'
import { genFieldNames } from '../utils'

/**
 * 过滤树形数据
 * @param tree 树形数据
 * @param callback 过滤函数
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
 * @param param2.hasChildren 是否为命中的节点保留 children 字段，默认为 false
 * @returns 过滤后的树形数据
 */
export function filterTree<T extends Record<string, any>>(
  tree: T[],
  callback: (node: T) => boolean,
  { fieldNames = {}, deep = true, basedOnChildren = true, hasChildren = false }:
  Pick<TreeOptions, 'fieldNames' | 'deep' | 'basedOnChildren' | 'hasChildren'> = {},
): T[] {
  const _fieldNames = genFieldNames(fieldNames)
  const { children: childrenKey } = _fieldNames
  const result: T[] = []
  const clonedTree = deep ? cloneDeep(tree) : [...tree]
  const stack = clonedTree.map(node => ({ node, parent: null as T | null }))

  while (stack.length > 0) {
    const { node, parent } = stack.pop()!
    const currentNode: T = { ...node, children: [] } as T
    let children = node[childrenKey] || []
    if (!hasChildren)
      children = []

    const isValid = callback(node)
    if (basedOnChildren) {
      if (children.length > 0 || isValid)
        parent ? parent[childrenKey].push(currentNode) : result.push(currentNode)
    }
    else {
      if (isValid)
        parent ? parent[childrenKey].push(currentNode) : result.push(currentNode)
    }
    for (const child of children)
      stack.push({ node: child, parent: currentNode })
  }

  return result
}
