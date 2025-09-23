/* eslint-disable jsdoc/check-param-names */
import { cloneDeep, uniqueId } from 'lodash-es'
import type { TreeFlatNode, TreeNode, TreeOptions } from '../types'
import { genFieldNames } from '../utils'

/**
 * 树形数据转为扁平数据
 * @param tree 树形数据
 * @param param1 配置项
 * @param param1.fieldNames 字段名
 * @param param1.fieldNames.id id 字段名，默认为 'id'
 * @param param1.fieldNames.name 名称字段名，默认为 'name'
 * @param param1.fieldNames.parentId 父级 id 字段名，默认为 'parentId'
 * @param param1.fieldNames.parentIds 父级 id 路径字段名，默认为 'parentIds'
 * @param param1.fieldNames.parent 父级字段名，默认为 'parent'
 * @param param1.fieldNames.children 子级字段名，默认为 'children'
 * @param param1.fieldNames.depth 深度字段名，默认为 'depth'
 * @param param1.fieldNames.path 路径字段名，默认为 'path'
 * @param param1.fieldNames.isLeaf 是否为叶子节点字段名，默认为 'isLeaf'
 * @param param1.hasChildren 是否为保留 children 字段，默认为 false
 * @param param1.cloneDeep 是否深拷贝数据，默认为 true
 * @param param1.extendAttrs 是否附加扩展树形数据，默认为 true
 * @returns 扁平数据
 */
export function treeToFlat<T = any, R = any>(
  tree: T[],
  { fieldNames = {}, hasChildren = false, deep = false, extendAttrs = true }: Pick<TreeOptions, 'fieldNames' | 'hasChildren' | 'deep' | 'extendAttrs'> = {},
): TreeFlatNode<R>[] {
  const _fieldNames = genFieldNames(fieldNames)
  const { id, name, parentId, parentIds, parent, depth, path, isLeaf, children } = _fieldNames
  const result: R[] = []
  const stack: TreeNode<T>[] = (deep ? cloneDeep(tree).reverse() : [...tree.reverse()]) as TreeNode<T>[] // 初始化栈，将树的根节点压入栈
  // 使用栈来进行非递归遍历

  while (stack.length > 0) {
    const node = stack.pop()! as any // 栈尾出栈
    const nodeHasChildren = node[children] && node[children].length
    const nodeId = node[id] || uniqueId()
    const nodeDepth = node[depth] || 0
    const nodePath = node[path] || `/${node[name]}`
    const nodeParentIds = node[parentIds] || []
    if (extendAttrs) {
      node[id] = nodeId
      if (!node[name])
        node[name] = ''
      if (!node[isLeaf])
        node[isLeaf] = !nodeHasChildren
      if (!node[parentId]) {
        node[parentId] = null
        node[parentIds] = nodeParentIds
        node[depth] = nodeDepth
        node[path] = nodePath
      }
    }

    if (nodeHasChildren) {
      const { [children]: _children, ...parentWithoutChildren } = node
      if (extendAttrs) {
        for (const item of _children) {
          item[parentId] = nodeId
          item[parentIds] = [...nodeParentIds, nodeId]
          item[parent] = parentWithoutChildren
          item[depth] = nodeDepth + 1
          item[path] = `${nodePath}/${item[name]}`
        }
      }

      if (!hasChildren)
        delete node[children] // 扁平化，不需要 children 字段

      // 保持顺序，将子节点添加到栈的末尾
      stack.push(..._children.reverse())
    }

    // 添加到结果数组
    result.push(node as R)
  }

  return result as TreeFlatNode<R>[]
}
