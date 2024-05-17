/* eslint-disable jsdoc/check-param-names */
import * as _ from 'lodash-es'
import { flatToTree } from '../flatToTree'
import { treeToFlat } from '../treeToFlat'
import type { TreeCallBack, TreeFlatNode, TreeNode, TreeOptions } from '../types'
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
export function mapTree<
  T extends Record<string, any>,
  R = TreeNode<T>,
>(tree: T[], callback: TreeCallBack<TreeFlatNode<T>, R>, {
  fieldNames = {},
  hasEmptyChildren = false,
}: TreeOptions = {}): R[] {
  const _fieldNames = genFieldNames(fieldNames)
  const { id, parentId, parentIds } = _fieldNames
  const flatNodes = treeToFlat(tree, {
    fieldNames,
  })

  const mapNodes = flatNodes.map((item) => {
    const newItem = callback(item) as TreeNode<T>
    const itemId = _.get(item, id)
    const itemParentId = _.get(item, parentId)
    const itemParentIds = _.get(item, parentIds)
    _.set(newItem, id, itemId)
    _.set(newItem, parentId, itemParentId)
    _.set(newItem, parentIds, itemParentIds)
    return newItem
  })

  return flatToTree(mapNodes, {
    fieldNames,
    hasEmptyChildren,
  }) as R[]
}
