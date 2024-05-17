/* eslint-disable jsdoc/check-param-names */
import { treeToFlat } from '../treeToFlat'
import type { TreeCallBack, TreeFlatNode, TreeNode, TreeOptions } from '../types'
import { genFieldNames } from '../utils'

/**
 * 查找树形数据中的节点
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
 * @returns 查找到的节点
 */
export function findTree<
  T,
  R = TreeNode<T> | TreeFlatNode<T>,
>(
  tree: T[],
  callback: TreeCallBack<TreeFlatNode<T>>,
  {
    fieldNames = {},
  }: TreeOptions = {},
): R | undefined {
  const _fieldNames = genFieldNames(fieldNames)

  const flatNodes = treeToFlat(tree, {
    fieldNames: _fieldNames,
    hasChildren: true,
  })

  return flatNodes.find(item => callback(item)) as R | undefined
}
