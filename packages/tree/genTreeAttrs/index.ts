/* eslint-disable jsdoc/check-param-names */
import { flatToTree } from '../flatToTree'
import { treeToFlat } from '../treeToFlat'
import type { TreeNode, TreeOptions } from '../types'
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
 * @returns 生成后的树形数据
 */
export function genTreeAttrs<
  T,
  R = TreeNode<T>,
>(tree: T[], {
  fieldNames = {},
}: TreeOptions = {}): R[] {
  const _fieldNames = genFieldNames(fieldNames)
  const { id, parentId, children } = _fieldNames
  const flatNodes = treeToFlat(tree, {
    fieldNames: _fieldNames,
  })
  return flatToTree(flatNodes, {
    fieldNames: {
      id,
      parentId,
      children,
    },
  }) as R[]
}
