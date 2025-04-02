export interface TreeOptions {
  fieldNames?: {
    id?: string
    name?: string
    parentId?: string
    parentIds?: string
    parent?: string
    children?: string
    depth?: string
    path?: string
    isLeaf?: string
    count?: string
  }
  deep?: boolean
  separator?: string
  isNameInPath?: boolean
  hasChildren?: boolean
  hasEmptyChildren?: boolean
  /**
   * 用于 filterTree，是否基于子元素来过滤，
   * 基于子节点过滤为只要树形上的某条线上有任意节点符合条件，就需要保留树形一整条线的节点
   * 不基于子节点过滤的话，则保留下来的所有节点都需要符合条件
   */
  basedOnChildren?: boolean
  /**
   * 用于 flatToTree,treeToFlat 确定生成的树形是否需要 parentIds,parent,path,depth,isLeaf 等树形树形
   */
  extendAttrs?: boolean
  /**
   * 用于汇总树形数据的字段
   */
  summaryFields?: string[]
  /**
   * 用于 flatToTree，是否扁平化
   * 默认为 false
   */
  flat?: boolean
}

export type TreeNode<T = object> = {
  id?: string | number
  parentId?: string | number | null
  parentIds?: (string | number)[] | null
  parent?: TreeNode<T> | null
  children?: TreeNode<T>[] | null
  path?: string
  depth?: number
  isLeaf?: boolean
  [key: string]: any
} & T

export type TreeFlatNode<T> = {
  id?: string | number
  parentId?: string | number | null
  parentIds?: (string | number)[] | null
  parent?: TreeNode<T> | null
  path?: string
  depth?: number
  isLeaf?: boolean
  [key: string]: any
} & T
