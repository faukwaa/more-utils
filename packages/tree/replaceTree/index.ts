/* eslint-disable jsdoc/check-param-names */
import * as _ from 'lodash-es'
import type { TreeOptions } from '../types'
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
export function replaceTree<T = any, R = any>(
  tree: T[],
  newNode: T,
  callback: (node: T) => boolean,
  { fieldNames = {} }: Pick<TreeOptions, 'fieldNames'> = {},
): T[] | R[] {
  const _fieldNames = genFieldNames(fieldNames)
  const { id, children } = _fieldNames
  const stack: T[] = [...tree] // 使用栈来迭代处理树结构
  const resultTree: T[] = [...tree] // 保持原树结构

  while (stack.length > 0) {
    const currentNode = stack.pop() as T

    // 如果 callback 返回 true，替换该节点
    if (callback(currentNode)) {
      const parent = findParentNode(resultTree, currentNode, { fieldNames })
      if (parent) {
        const index = (parent as Record<string, any>)[children]
          .findIndex((node: T) => (node as Record<string, any>)[id] === (currentNode as Record<string, any>)[id])
        ;(parent as Record<string, any>)[children][index] = {
          ...newNode,
          [children]: (currentNode as Record<string, any>)[children] || [], // 保留原有的子节点（如有）
        }
      }
    }

    // 如果存在子节点，将子节点加入栈
    if ((currentNode as Record<string, any>)[children] && (currentNode as Record<string, any>)[children].length > 0)
      stack.push(...(currentNode as Record<string, any>)[children])
  }

  return resultTree
}

// 辅助函数：查找父节点
function findParentNode<T = any>(
  tree: T[],
  targetNode: T,
  { fieldNames = {} }: TreeOptions = {},
): T | null {
  const { id = 'id', children = 'children' } = fieldNames
  const stack: T[] = [...tree]

  while (stack.length > 0) {
    const node = stack.pop() as T

    if (
      (node as Record<string, any>)[children]
      && (node as Record<string, any>)[children].some(
        (child: T) => (child as Record<string, any>)[id] === (targetNode as Record<string, any>)[id],
      )
    )
      return node // 找到父节点

    if ((node as Record<string, any>)[children] && (node as Record<string, any>)[children].length > 0)
      stack.push(...(node as Record<string, any>)[children])
  }

  return null
}
