/* eslint-disable jsdoc/check-param-names */
import { cloneDeep } from 'lodash-es'
import type { TreeNode, TreeOptions } from '../types'
import { genFieldNames } from '../utils'

/**
 * 扁平数据转为树形数据
 * @param data 扁平数据
 * @param param1 配置项
 * @param param1.fieldNames 字段名
 * @param param1.fieldNames.id id 字段名，默认为 'id'
 * @param param1.fieldNames.parentId 父级 id 字段名，默认为 'parentId'
 * @param param1.fieldNames.children 子级字段名，默认为 'children'
 * @param param1.cloneDeep 是否深拷贝，默认为 true
 * @param param1.extendAttrs 是否附加扩展树形，默认为 true
 * @returns 树形数据
 */
export function flatToTree<T>(data: T[], {
  fieldNames = {},
  deep = false,
  extendAttrs = true,
}: Pick<TreeOptions, 'fieldNames' | 'deep' | 'extendAttrs'> = {}): TreeNode<T>[] {
  const _fieldNames = genFieldNames(fieldNames)
  const { id, name, parentId, parentIds, parent, depth, path, isLeaf, children } = _fieldNames
  const idMap: Record<string, TreeNode<T>> = {}
  const result: TreeNode<T>[] = []
  const _data = deep ? cloneDeep(data) : [...data]
  // 遍历扁平数组，浅拷贝节点，并构建映射表
  _data.forEach((node: any) => {
    node[children] = []
    if (extendAttrs) {
      node[parentIds] = []
      node[parent] = null
      node[depth] = 0
      node[path] = ''
      node[isLeaf] = false
    }
    const { [children]: _children, ...nodeWithoutChildren } = node
    const existNode = idMap[node[id]]
    if (existNode)
      idMap[node[id]] = Object.assign(existNode, nodeWithoutChildren)
    else
      idMap[node[id]] = node

    if (node[parentId] === null) {
      // 根节点直接添加到结果
      result.push(node)
      if (extendAttrs) {
        node[depth] = 0
        node[path] = `/${node[name]}`
        node[isLeaf] = !node[children].length
      }
    }
    else {
      let parentNode: any = idMap[node[parentId]]
      if (!parentNode) {
        parentNode = { id: node[parentId], children: [] }
        if (extendAttrs) {
          parentNode[parentIds] = []
          parentNode[parent] = null
          parentNode[depth] = 0
          parentNode[path] = ''
        }
        idMap[node[parentId]] = parentNode
      }

      const { [children]: _children, ...parentWithoutChildren } = parentNode

      if (extendAttrs) {
        node[parent] = parentWithoutChildren as TreeNode<T>
        node[parentIds] = parentNode[parentIds].concat(parentNode[id])
        node[depth] = parentNode[depth] + 1
        node[path] = `${parentNode[path]}/${node[name]}`
        node[isLeaf] = !node[children].length
      }
      _children.push(node)
    }
  })

  return result
}
