/* eslint-disable jsdoc/check-param-names */
import * as _ from 'lodash-es'
import { flatToTree } from '../flatToTree'
import { treeToFlat } from '../treeToFlat'
import type { TreeCallBack, TreeFlatNode, TreeNode, TreeOptions } from '../types'
import { genFieldNames } from '../utils'

/**
 * 替换属性节点
 * @param tree 树形数据
 * @param callback 查找函数
 * @param newNode 新节点
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
 * @returns 替换后的树形数据
 */
export function replaceTree<
  T,
  R = TreeNode<T>,
>(tree: T[], newNode: TreeNode<T>, callback: TreeCallBack<TreeFlatNode<T>>, {
  fieldNames = {},
}: TreeOptions = {}): T[] | R[] {
  const _fieldNames = genFieldNames(fieldNames)
  const { id, parentId, parentIds, children } = _fieldNames
  const flatNodes = treeToFlat(tree, {
    fieldNames,
  })

  const node = flatNodes.find(item => callback(item))

  if (node) {
    // 找出符合 callback 的一整条线上的子节点，去除掉
    const withoutOldNodeChildren = flatNodes.filter(item =>
      !_.get(item, parentIds)?.includes(_.get(node, id)))

    const withNewNode = withoutOldNodeChildren.map((item) => {
      if (callback(item))
        return newNode

      return item
    })
    const newFlatNodes = treeToFlat(withNewNode, {
      fieldNames,
    })
    return flatToTree(newFlatNodes, {
      fieldNames: {
        id,
        parentId,
        children,
      },
    }) as R[]
  }

  return tree as unknown as R[]
}
