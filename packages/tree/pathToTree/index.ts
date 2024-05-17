/* eslint-disable jsdoc/check-param-names */
import * as _ from 'lodash-es'
import type { TreeNode, TreeOptions } from '../types'

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
  T,
  R = TreeNode<T>,
>(data: T[], {
  fieldNames = {},
  separator = '/',
  hasEmptyChildren = false,
  isNameInPath = true,
  cloneDeep = true,
}: TreeOptions = {}): R[] {
  const _fieldNames = {
    id: fieldNames.id || 'id',
    path: fieldNames.path || 'path',
    name: fieldNames.name || 'name',
    children: fieldNames.children || 'children',
  }
  const result: R[] = []
  // 以 path[0] 为 key 的 map
  data.forEach((d) => {
    const item = cloneDeep ? _.cloneDeep(d) : d
    let path = _.get(item, _fieldNames.path) as string
    if (path && path.startsWith(separator))
      path = path.slice(1)

    if (path) {
      const pathArr = path.split(separator)
      // 如果 nameKey 不在 path 中，则将 nameKey 的值 push 进去
      if (!isNameInPath)
        pathArr.push(_.get(item, _fieldNames.name))

      // _.result 默认为 result，此处为浅拷贝，将 result 的引用赋值给 _.result，push 也会改变 result
      let _result = result
      pathArr.forEach((p: string, index: number) => {
        // 从当前的 result 中查找此路径的节点是否存在(_.result 是 result 的引用，所以这里查找的就是 result)
        let obj = _result.find(t => _.get(t, _fieldNames.name) === p) as object

        // 若不存在则根据该路径创建一个节点
        if (!obj) {
          obj = (p === pathArr[pathArr.length - 1] ? { ...item } : {}) as object
          if (!_.has(obj, _fieldNames.id))
            _.set(obj, _fieldNames.id, pathArr.slice(0, index + 1).join(separator))

          _.set(obj, _fieldNames.name, p)
          _.set(obj, _fieldNames.children, [])

          _result.push(obj as R)
          // 若当前被增节点是叶子节点，则裁剪该节点子节点属性
          if (p === pathArr[pathArr.length - 1] && !hasEmptyChildren)
            _.unset(obj, _fieldNames.children)
        }
        // 若已存在则将 _.result 指向该节点的 children 的引用，
        // 去找下一层路径在该节点的 children 中是否存在，存在则继续引用下一层的 children
        _result = _.get(obj, _fieldNames.children, [])
      })
    }
    else {
      result.push(item as unknown as R)
    }
  })
  return result
}
