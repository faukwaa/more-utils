/* eslint-disable jsdoc/check-param-names */
import * as _ from 'lodash-es'
import type { TreeNode, TreeOptions } from '../types'
import { genFieldNames } from '../utils'
import { treeToFlat } from '../treeToFlat'

/**
 * 扁平数据转为树形数据
 * @param data 扁平数据
 * @param param1 配置项
 * @param param1.fieldNames 字段名
 * @param param1.fieldNames.id id 字段名，默认为 'id'
 * @param param1.fieldNames.parentId 父级 id 字段名，默认为 'parentId'
 * @param param1.fieldNames.children 子级字段名，默认为 'children'
 * @param param1.hasEmptyChildren 是否为每个节点添加一个空的 children 字段，默认为 true
 * @param param1.cloneDeep 是否深拷贝，默认为 true
 * @returns 树形数据
 */
export function flatToTree<
  T,
  R = TreeNode<T>,
>(data: T[], {
  fieldNames = {},
  hasEmptyChildren = true,
  cloneDeep = true,
  hasTreeAttrs = true,
}: TreeOptions = {}): R[] {
  const _fieldNames = genFieldNames(fieldNames)
  const { id, parentId, children } = _fieldNames

  let result: R[] = []
  // 以 id 为 key 的 map
  const itemMap: Record<string, R> = {}
  for (const d of data) {
    const item = (cloneDeep ? _.cloneDeep(d) : d)
    const itemId = _.get(item, id) as string
    const itemParentId = _.get(item, parentId) as string | number

    // 在 itemMap 中不存在就先放个空的 children 的元素
    // (hasEmptyChildren 为 false 的时候 children 不用设置)，id 为 key
    if (!_.has(itemMap, itemId)) {
      itemMap[itemId] = {} as never
      if (hasEmptyChildren)
        _.set(itemMap[itemId], children, [])
    }

    // 在 itemMap 中肯定已存在当前 item 为 key 的元素（因为上面判断过，不存在也会插入个空的 {}），
    // 将 item 自身合并进去，children 除外，children 通过后面的元素插入进去。(因为前面可能有子元素添加空的父元素的时候已经把当前 item 插入到 itemMap 里面了 )
    itemMap[itemId] = Object.assign(itemMap[itemId] as object, _.omit(item as object, children)) as R

    const treeItem = itemMap[itemId]
    // itemParentId 为非则是根节点，直接放入结果中
    if (!itemParentId) {
      result.push(treeItem as R)
    }
    else {
      // parent 还没插入 itemMap 的话先用 parent 的 id 插入个空的 children 进去
      if (!_.has(itemMap, itemParentId)) {
        itemMap[itemParentId] = {} as never
        _.set(itemMap[itemParentId] as object, children, [])
      }
      const itemParent = itemMap[itemParentId]

      // 取父级原本的 children，父级可能没有 children
      let itemParentChildren = _.get(itemParent, children) as R[]
      if (!itemParentChildren) {
        _.set(itemParent as object, _fieldNames.children, [])
        itemParentChildren = _.get(itemParent, children)
      }
      itemParentChildren.push(treeItem as R)
    }
  }

  if (hasTreeAttrs)
    result = flatToTree(treeToFlat(result, { fieldNames }), { fieldNames, hasTreeAttrs: false })

  return result
}
