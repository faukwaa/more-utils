import type { TreeOptions } from '../types'

export function genFieldNames(fieldNames: TreeOptions['fieldNames']) {
  return {
    id: fieldNames?.id || 'id',
    name: fieldNames?.name || 'name',
    parentId: fieldNames?.parentId || 'parentId',
    parentIds: fieldNames?.parentIds || 'parentIds',
    parent: fieldNames?.parent || 'parent',
    children: fieldNames?.children || 'children',
    depth: fieldNames?.depth || 'depth',
    path: fieldNames?.path || 'path',
    isLeaf: fieldNames?.isLeaf || 'isLeaf',
  }
}
