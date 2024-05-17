/* eslint-disable jsdoc/check-param-names */
import { treeToFlat } from '../treeToFlat'
import type { TreeCallBack, TreeFlatNode, TreeNode, TreeOptions } from '../types'
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
export function eachTree<T>(tree: TreeNode<T>[], callback: TreeCallBack<TreeFlatNode<T>>, {
  fieldNames = {},
}: TreeOptions = {}): void {
  const _fieldNames = genFieldNames(fieldNames)
  const flatNodes = treeToFlat(tree, {
    fieldNames: _fieldNames,
    cloneDeep: false,
    hasChildren: true,
  })

  flatNodes.forEach(item => callback(item))
}
