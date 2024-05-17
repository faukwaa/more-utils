export type RecordKey = string | number | symbol

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
  }
  hasEmptyChildren?: boolean
  cloneDeep?: boolean
  separator?: string
  isNameInPath?: boolean
  hasChildren?: boolean
  flat?: boolean
  basedOnChildren?: boolean
}

export type TreeNode<T> = {
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

export type TreeCallBack<T extends Record<string, any>, R = T> =
  (item: T) => TreeNode<R> | boolean | void
