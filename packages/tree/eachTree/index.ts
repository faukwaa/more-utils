/* eslint-disable jsdoc/check-param-names */
import type { TreeOptions } from '../types'
import { genFieldNames } from '../utils'

/**
 * 遍历树形节点
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
 */
export function eachTree<T extends Record<string, any>>(
  tree: T[],
  callback: (node: T, index: number, parent: T | null) => void,
  { fieldNames = {} }: Pick<TreeOptions, 'fieldNames'> = {},
): void {
  const _fieldNames = genFieldNames(fieldNames)
  const { children } = _fieldNames

  // 使用栈存储节点及其父节点信息
  const stack: { node: T, index: number, parent: T | null }[] = tree.map((node, index) => ({
    node,
    index,
    parent: null,
  }))

  // 迭代遍历
  while (stack.length > 0) {
    const { node, index, parent } = stack.pop()!

    // 对当前节点执行回调
    callback(node, index, parent)

    // 如果有子节点，将子节点推入栈
    if (node[children] && node[children].length > 0) {
      for (let i = node[children].length - 1; i >= 0; i--)
        stack.push({ node: node[children][i], index: i, parent: node })
    }
  }
}
