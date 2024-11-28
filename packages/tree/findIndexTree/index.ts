/* eslint-disable jsdoc/check-param-names */
import { cloneDeep } from 'lodash-es'
import type { TreeOptions } from '../types'
import { genFieldNames } from '../utils'

/**
 * 查找树形数据中 node 的 index
 * @param tree 树形数据
 * @param callback 查找函数
 * @param param3 配置项
 * @param param3.fieldNames 字段名
 * @param param3.fieldNames.id id 字段名，默认为 'id'
 * @param param3.fieldNames.name 名称字段名，默认为 'name'
 * @param param3.fieldNames.parentId 父级 id 字段名，默认为 'parentId'
 * @param param3.fieldNames.parentIds 父级 id 路径字段名，默认为 'parentIds'
 * @param param3.fieldNames.parent 父级字段名，默认为 'parent'
 * @param param3.fieldNames.children 子级字段名，默认为 'children'
 * @param param3.fieldNames.depth 深度字段名，默认为 'depth'
 * @param param3.fieldNames.path 路径字段名，默认为 'path'
 * @param param3.fieldNames.isLeaf 是否为叶子节点字段名，默认为 'isLeaf'
 * @param param2.deep 是否进行深拷贝，默认为 true
 * @returns node 的 index
 */
export function findIndexTree<T extends Record<string, any>>(
  tree: T[],
  callback: (node: T) => boolean,
  { fieldNames = {}, deep = true }: Pick<TreeOptions, 'fieldNames' | 'deep'> = {},
): number[] | null {
  const _fieldNames = genFieldNames(fieldNames)
  const { children } = _fieldNames
  const _tree = deep ? cloneDeep(tree) : tree

  const stack: { node: T, path: number[] }[] = _tree.map((node, index) => ({ node, path: [index] })).reverse()

  while (stack.length > 0) {
    const { node, path } = stack.pop()!

    // 检查当前节点是否符合条件
    if (callback(node))
      return path

    // 如果有子节点，将子节点压入栈，并记录路径
    if (node[children] && node[children].length > 0) {
      for (let i = node[children].length - 1; i >= 0; i--)
        stack.push({ node: node[children][i], path: path.concat(i) })
    }
  }

  return null // 未找到符合条件的节点
}
