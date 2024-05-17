/* eslint-disable jsdoc/check-param-names */
import * as _ from 'lodash-es'
import type { TreeFlatNode, TreeOptions } from '../types'
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
 * @param param1.hasChildren 是否为每个节点添加一个空的 children 字段，默认为 false
 * @param param1.cloneDeep 是否深拷贝，默认为 true
 * @returns 扁平数据
 */
export function treeToFlat<
 T,
 R = TreeFlatNode<T>,
>(tree: T[], {
  fieldNames = {},
  hasChildren = false,
  cloneDeep = true,
}: TreeOptions = {}): R[] {
  const _fieldNames = genFieldNames(fieldNames)
  // 这里必须使用展开运算符，否则会改变原数组结构
  const stack = cloneDeep
    ? [..._.cloneDeep(tree).reverse()]
    : [...tree].reverse()
  const result: R[] = []
  while (stack.length) {
    // 底部 node 出栈，深度遍历
    const lastNode: T | undefined = stack.pop()
    if (lastNode) {
      const { id, name, parentId, parentIds, parent, depth, path, isLeaf, children: childrenKey } = _fieldNames

      if (!_.has(lastNode, id))
        _.set(lastNode, id, _.uniqueId())

      if (!_.has(lastNode, name))
        _.set(lastNode, name, '')

      // 没有 parentId 就设置个空的
      if (!_.has(lastNode, parentId))
        _.set(lastNode, parentId, null)

      // 没有 parentIds 就设置个空数组
      if (!_.has(lastNode, parentIds))
        _.set(lastNode, parentIds, [])

      if (!_.has(lastNode, depth))
        _.set(lastNode, depth, 0)

      if (!_.has(lastNode, path))
        _.set(lastNode, path, `${_.get(lastNode, name)}`)

      const children = _.get(lastNode, childrenKey, []) as T[]
      _.set(lastNode, isLeaf, children.length === 0)
      const lastNodeId = _.get(lastNode, id)
      const lastNodeParentIds = _.get(lastNode, parentIds)

      if (children.length) {
        // children 记录好 parentId parentIds
        children.forEach((item) => {
          _.set(item as object, parentId, lastNodeId)
          _.set(item as object, parentIds, lastNodeParentIds.concat(lastNodeId))
          _.set(item as object, parent, _.omit(lastNode, childrenKey))
          _.set(item as object, depth, _.get(lastNode, depth) + 1)
          _.set(item as object, path, `${_.get(lastNode, path)}/${_.get(item, name)}`)
        })
        const _children = cloneDeep
          ? _.cloneDeep(children).reverse()
          : [...children].reverse()
        stack.push(..._children)
      }
      if (!hasChildren) {
        // 转扁平不需要 children
        _.unset(lastNode, childrenKey)
      }
      result.push(lastNode as R)
    }
  }

  return result
}
