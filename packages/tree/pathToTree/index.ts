/* eslint-disable jsdoc/check-param-names */
import { cloneDeep, uniqueId } from 'lodash-es'
import type { TreeNode, TreeOptions } from '../types'
import { genFieldNames } from '../utils'

/**
 * 扁平数据通过 Path 转为树形数据
 * @param data 扁平数据
 * @param param1 配置项
 * @param param1.fieldNames 字段名
 * @param param1.fieldNames.id id 字段名，默认为 'id'
 * @param param1.fieldNames.path 路径字段名，默认为 'path'
 * @param param1.fieldNames.name 名称字段名，默认为 'name'
 * @param param1.fieldNames.children 子级字段名，默认为 'children'
 * @param param1.separator 路径分隔符，默认为 '/'
 * @param param1.hasEmptyChildren 是否为每个节点添加一个空的 children 字段，默认为 false
 * @param param1.isNameInPath 路径中是否包含 name 字段，默认为 true
 * @param param1.cloneDeep 是否深拷贝，默认为 true
 * @returns 树形数据
 */
export function pathToTree<
T extends Record<string, any>,
>(data: T[], {
  fieldNames = {},
  separator = '/',
  isNameInPath = true,
  deep = true,
  extendAttrs = true,
}: Pick<TreeOptions, 'fieldNames' | 'separator' | 'isNameInPath' | 'deep' | 'extendAttrs'> = {}): TreeNode<T>[] {
  const _fieldNames = genFieldNames(fieldNames)
  const { id, name, children, parentIds, parent, depth, path, isLeaf } = _fieldNames
  const tree: TreeNode<T>[] = []
  const _data = deep ? cloneDeep(data) : [...data]

  // 遍历每条路径
  _data.forEach((item: any) => {
    const pathValue = item[path] // 获取节点路径
    const normalizedPath = pathValue.startsWith(separator) ? pathValue.slice(1) : pathValue // 去除开头的分隔符
    const paths: string[] = normalizedPath.split(separator) // 拆分路径为节点名称
    let currentLevel = tree
    let parentNode: TreeNode<T> | null = null
    const parentIdsArray: string[] = []

    // 遍历路径中的每个节点名称
    paths.forEach((nodePath, index) => {
      let existingNode: any = currentLevel.find(node => node[path] === nodePath)

      // 如果不存在，则创建一个新的节点
      if (!existingNode) {
        existingNode = {
          [name]: nodePath,
          [children]: [],
        } as TreeNode<T>

        // 如果 extendAttrs 为 true，扩展节点属性
        if (extendAttrs) {
          existingNode[id] = existingNode[id] || uniqueId()

          // 创建父节点的副本并去掉 children 属性
          const parentNodeWithoutChildren = parentNode ? { ...parentNode } : null
          if (parentNodeWithoutChildren)
            delete parentNodeWithoutChildren[children] // 删除 children 属性

          existingNode[parent] = parentNodeWithoutChildren // 添加父节点引用（无 children）

          existingNode[parentIds] = [...parentIdsArray]
          existingNode[depth] = index
          existingNode[path] = `${separator}${paths.slice(0, index + 1).join(separator)}`
          existingNode[isLeaf] = index === paths.length - 1 // 使用 isLeaf 字段定义叶子节点
        }

        currentLevel.push(existingNode)
      }

      // 如果是路径中的最后一个部分，且 isNameInPath 为 true，复制或直接合并 item
      if (index === paths.length - 1 && isNameInPath) {
        const { [name]: _, ...rest } = item // 保留 item 中除 name 以外的其他属性
        Object.assign(existingNode, rest) // 合并其他属性
        if (extendAttrs)
          existingNode[isLeaf] = true // 使用 isLeaf 字段定义叶子节点
      }

      // 设置下一层级为子节点层级，继续下一层
      parentNode = existingNode
      parentIdsArray.push(existingNode[id] || '')
      currentLevel = existingNode[children] as TreeNode<T>[]
    })
  })

  return tree
}
