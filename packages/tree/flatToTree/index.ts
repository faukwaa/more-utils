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
 * @param param1.deep 是否深拷贝，默认为 true
 * @param param1.extendAttrs 是否附加扩展属性，默认为 true
 * @returns 树形数据
 */
export function flatToTree<T>(data: T[], {
  fieldNames = {},
  deep = false,
  hasEmptyChildren = false,
  isNameInPath = true,
  extendAttrs = true,
}: Pick<TreeOptions, 'fieldNames' | 'deep' | 'hasEmptyChildren' | 'isNameInPath' | 'extendAttrs'> = {}): TreeNode<T>[] {
  const _fieldNames = genFieldNames(fieldNames)
  const { id, name, parentId, parentIds, parent, depth, path, isLeaf, children } = _fieldNames
  const idMap: Record<string, TreeNode<T>> = {}
  const result: TreeNode<T>[] = []
  const _data = deep ? cloneDeep(data) : [...data]

  // 缓存机制：存储已计算的深度和父级ID列表
  const depthCache: Record<string, number> = {}
  const parentIdsCache: Record<string, string[]> = {}

  // 辅助函数：收集所有父级 ID
  const collectParentIds = (nodeId: string): string[] => {
    if (!parentIdsCache[nodeId]) {
      const node = idMap[nodeId]
      if (!node || !node[parentId])
        parentIdsCache[nodeId] = []
      else
        parentIdsCache[nodeId] = [node[parentId], ...collectParentIds(node[parentId])]
    }
    return parentIdsCache[nodeId]
  }

  // 辅助函数：计算节点深度
  const calculateDepth = (nodeId: string): number => {
    if (!depthCache[nodeId]) {
      const node = idMap[nodeId]
      if (!node || !node[parentId])
        depthCache[nodeId] = 0
      else
        depthCache[nodeId] = calculateDepth(node[parentId]) + 1
    }
    return depthCache[nodeId]
  }

  // 第一次遍历：建立基本映射关系
  _data.forEach((node: any) => {
    if (!node[id])
      throw new Error(`Node missing required field 'id': ${JSON.stringify(node)}`)
    if (hasEmptyChildren)
      node[children] = []
    idMap[node[id]] = node
  })

  // 第二次遍历：构建树形结构并设置属性
  _data.forEach((node: any) => {
    if (extendAttrs) {
      try {
        // 计算深度
        node[depth] = calculateDepth(node[id])

        // 收集父级IDs
        node[parentIds] = collectParentIds(node[id])

        // 构建路径
        const pathParts: string[] = []
        let current = node
        while (current) {
          pathParts.push(isNameInPath ? current[name] : current[name])
          current = idMap[current[parentId]]
        }
        node[path] = `/${pathParts.reverse().join('/')}`

        // 设置叶子节点标志
        node[isLeaf] = true
      }
      catch (error) {
        console.error(`Error processing node with id=${node[id]}:`, error)
      }
    }

    if (!node[parentId]) {
      result.push(node)
    }
    else {
      const parentNode = idMap[node[parentId]] as any
      if (parentNode) {
        if (!parentNode[children])
          parentNode[children] = []
        parentNode[isLeaf] = false

        const { [children]: _, ...parentWithoutChildren } = parentNode
        if (extendAttrs)
          node[parent] = parentWithoutChildren as TreeNode<T>

        parentNode[children].push(node)
      }
    }
  })

  return result
}
