/* eslint-disable jsdoc/check-param-names */
import type { TreeOptions } from '../types'
import { genFieldNames } from '../utils'

/**
 * 生成树形的一些属性
 * @param tree 树形数据
 * @param param1 默认的 key
 * @param param1.childrenKey 子节点的 key，默认为 'children'
 * @param param1.parentIdKey 父节点 id 的 key，默认为 'parentId'
 * @param param1.parentIdsKey 父节点 id 路径的 key，默认为 'parentIds'
 * @param param1.parentKey 父节点的 key，默认为 'parent'
 * @param param1.depthKey 节点深度的 key，默认为 'depth'
 * @param param1.pathKey 节点路径的 key，默认为 'path'
 * @param param1.nameKey 节点名称的 key，默认为 'name'
 * @param param1.idKey 节点 id 的 key，默认为 'id'
 */
export function genTreeAttrs<T = any>(
  tree: T[],
  { fieldNames = {} }: Pick<TreeOptions, 'fieldNames'> = {},
): void {
  const _fieldNames = genFieldNames(fieldNames)
  const { id, name, children, parent: parentKey, parentIds: parentIdsKey, depth: depthKey, path: pathKey, isLeaf: isLeafKey } = _fieldNames

  // 栈用于深度优先遍历，初始时根节点入栈
  const stack: { node: any, parent: T | null, parentIds: any[], depth: number, path: string }[] = tree.map(node => ({
    node,
    parent: null,
    parentIds: [],
    depth: 0,
    path: `/${(node as Record<string, any>)[name]}`,
  }))

  // 迭代遍历
  while (stack.length > 0) {
    const { node, parent, parentIds, depth, path } = stack.pop()!

    // 设置当前节点的属性
    node[parentKey] = parent ? { ...parent, children: undefined } : null // 父节点引用，去除 children 属性
    node[parentIdsKey] = parentIds // 父节点 ID 列表
    node[depthKey] = depth // 深度
    node[pathKey] = path // 路径
    node[isLeafKey] = !node[children] || node[children].length === 0 // 是否叶子节点

    // 如果有子节点，将子节点推入栈，同时更新路径、深度等信息
    if (node[children] && node[children].length > 0) {
      for (let i = node[children].length - 1; i >= 0; i--) {
        const child = node[children][i]
        stack.push({
          node: child,
          parent: { ...node, children: undefined }, // 创建 parent 的浅拷贝，并去掉 children
          parentIds: [...parentIds, node[id]], // 更新 parentIds
          depth: depth + 1, // 子节点深度增加
          path: `${path}/${child[name]}`, // 更新路径
        })
      }
    }
  }
}
