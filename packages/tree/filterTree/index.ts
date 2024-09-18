/* eslint-disable jsdoc/check-param-names */
import type { TreeOptions } from '../types'
import { genFieldNames } from '../utils'
import { treeToFlat } from '../treeToFlat'
import { flatToTree } from '../flatToTree'

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
 * @param param2.hasChildren 是否为命中的节点保留 children 字段，默认为 false
 * @returns 过滤后的树形数据
 */
export function filterTree<T extends Record<string, any>>(
  tree: T[],
  callback: (node: T) => boolean,
  { fieldNames = {}, deep = true, basedOnChildren = true, hasChildren = false, flat = false, extendAttrs = false }:
  Pick<TreeOptions, 'fieldNames' | 'deep' | 'basedOnChildren' | 'hasChildren' | 'flat' | 'extendAttrs'> = {},
): T[] {
  const _fieldNames = genFieldNames(fieldNames)
  const { id, parentIds, parent, depth, path, isLeaf } = _fieldNames
  const flatData = treeToFlat(tree, { fieldNames, deep })
  const filterFlatData = flatData.filter(callback)

  const filterIds = new Set<string | number>(filterFlatData.map(node => node[id]))
  // 过滤后的父级 id 集合,basedOnChildren 为 true 时有效
  const filterParentIds = new Set<string | number>()
  // 过滤后的子级 id 集合,hasChildren 为 true 时有效
  const filterChildrenIds = new Set<string | number>()

  flatData.forEach((node) => {
    if (filterIds.has(node[id])) {
      if (basedOnChildren) {
        node[parentIds].forEach((parentId: string | number) => {
          filterParentIds.add(parentId)
        })
      }
    }

    if (hasChildren) {
      if (node[parentIds].filter((item: string | number) => filterIds.has(item)).length > 0)
        filterChildrenIds.add(node[id])
    }
  })

  const needNodes = flatData.filter(node => filterIds.has(node[id]) || filterParentIds.has(node[id]) || filterChildrenIds.has(node[id])).map((node) => {
    if (!extendAttrs) {
      const {
        [parentIds]: _parentIds,
        [parent]: _parent,
        [depth]: _depth,
        [path]: _path,
        [isLeaf]: _isLeaf,
        ...rest
      } = node
      return rest as T
    }
    return node
  })

  if (flat)
    return needNodes

  return flatToTree(needNodes, { fieldNames, deep: false, extendAttrs: false })
}
