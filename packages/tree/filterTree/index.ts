/* eslint-disable jsdoc/check-param-names */
import * as _ from 'lodash-es'
import { flatToTree } from '../flatToTree'
import { treeToFlat } from '../treeToFlat'
import type { TreeCallBack, TreeFlatNode, TreeNode, TreeOptions } from '../types'
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
 * @param param2.hasEmptyChildren 是否为每个节点添加一个空的 children 字段，默认为 false
 * @returns 过滤后的树形数据
 */
export function filterTree<
  T,
  R = TreeNode<T> | TreeFlatNode<T>,
>(tree: T[], callback: TreeCallBack<TreeFlatNode<T>>, {
  fieldNames = {},
  flat = false,
  hasEmptyChildren = false,
  basedOnChildren = true,
}: TreeOptions = {}): R[] {
  const _fieldNames = genFieldNames(fieldNames)
  const { id, parentId, parentIds, children } = _fieldNames

  // 先扁平化
  const flatNodes = treeToFlat<T>(tree, { fieldNames })
  // 查出所有符合条件的节点，包括父节点
  let needNodes = flatNodes.filter(item => callback(item))
  const needNodeIds = needNodes.map(item => _.get(item, id) as string | number)
  const notNeedNodeIds = flatNodes.filter(item => !callback(item)).map(item => _.get(item, id) as string | number)

  const needNodesPids: (string | number)[] = []

  needNodes.forEach((item) => {
    if (_.has(item, parentIds)) {
    // 不基于子节点的话，需要把所有父节点不符合条件的过滤掉
    // 基于子节点的话，只需要把所有父节点的 id 记录下来，就算父节点里面有不符合条件的也要
      if (!basedOnChildren) {
        const itemParentIds = _.get(item, parentIds) as (string | number)[]
        // 看看所有父级 id 和不需要的 id 有没有交集
        const intersection = _.intersection(itemParentIds, notNeedNodeIds)
        // 如果有交集，就把当前节点 id 从 needNodeIds 中去掉，并且父节点也不需要了
        if (intersection.length)
          needNodeIds.splice(needNodeIds.findIndex(id => _.get(item, id) === id), 1)
        else
          needNodesPids.push(..._.get(item, parentIds) as (string | number)[])
      }
      else {
        needNodesPids.push(..._.get(item, parentIds) as (string | number)[])
      }
    }
  })
  // 把所有 id 合并，去重
  const allNeedNodeIds = _.uniq(needNodeIds.concat(needNodesPids))
  needNodes = flatNodes.filter(item => allNeedNodeIds.includes(_.get(item, id)))

  if (flat)
    return needNodes as R[]

  return flatToTree(needNodes, {
    fieldNames: {
      id,
      parentId,
      children,
    },
    hasEmptyChildren,
  }) as R[]
}
