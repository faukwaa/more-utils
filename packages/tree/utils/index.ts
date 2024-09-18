import { cloneDeep } from 'lodash-es'
import type { TreeNode, TreeOptions } from '../types'

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
    count: fieldNames?.count || 'count',
  }
}

// 自定义的深拷贝函数，如果 structuredClone 不可用
export function deepClone<T>(obj: T): T {
  // 检查是否支持 structuredClone
  if (typeof structuredClone === 'function')
    return structuredClone(obj)

  else
    return cloneDeep(obj)
}

export function setValueByKey<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
  obj[key] = value
}

// 生成模拟树形数据的函数
export function generateTreeData(depth: number = 3, siblings: number = 2): TreeNode[] {
  const tree: TreeNode[] = []
  const stack: { node: TreeNode, currentDepth: number }[] = []
  let itemCount = 0
  for (let i = 1; i <= siblings; i++) {
    const rootNode: TreeNode = {
      id: `${i}`,
      name: `Node ${i}`,
      parentId: null,
      children: [],
    }
    tree.push(rootNode)
    stack.push({ node: rootNode, currentDepth: 1 })
    itemCount += 1
  }

  while (stack.length > 0) {
    const { node, currentDepth } = stack.pop()! // 取出栈顶的元素

    if (currentDepth < depth) {
      for (let i = 1; i <= siblings; i++) {
        const childNode: TreeNode = {
          id: `${node.id}-${i}`,
          name: `Node ${node.id}-${i}`,
          parentId: node.id,
          children: [],
        }

        node.children!.push(childNode)
        stack.push({ node: childNode, currentDepth: currentDepth + 1 })
        itemCount += 1
      }
    }
  }
  // eslint-disable-next-line no-console
  console.log(`数据总行数：${itemCount}`)
  return tree
}

export function generateFlatTreeData(
  depth: number = 3,
  childrenPerNode: number = 2,
): TreeNode[] {
  const rootId = '1'
  const flatData: TreeNode[] = []
  let currentId = 1

  function createNode(id: string, parentId: string | null, level: number) {
    const node: TreeNode = {
      id,
      parentId,
      name: `Node ${id}`,
    }
    flatData.push(node)

    if (level < depth) {
      for (let i = 0; i < childrenPerNode; i++) {
        currentId++
        createNode(currentId.toString(), id, level + 1)
      }
    }
  }

  createNode(rootId, null, 0) // 从根节点开始生成树
  // eslint-disable-next-line no-console
  console.log(`数据总行数：${flatData.length}`)
  return flatData
}

function progressBar(percent: number, startTime: number): void {
  const barLength = 30 // 进度条的长度
  const filledLength = Math.round(barLength * percent / 100)
  const bar = '█'.repeat(filledLength) + '-'.repeat(barLength - filledLength)

  // 计算已经使用的时间
  const elapsedTime = (Date.now() - startTime) // 毫秒
  // eslint-disable-next-line node/prefer-global/process
  process.stdout.write(`\r[${bar}] ${percent}% | 已使用时间: ${elapsedTime}ms`)
}

export async function executeWithProgressBar<T>(fn: () => Promise<T>, checkInterval: number = 100): Promise<T> {
  const startTime: number = Date.now()
  let percent = 0
  let taskFinished = false

  // 定时器更新进度条，任务未完成时最大只到 99%
  const interval = setInterval(() => {
    if (!taskFinished) {
      percent = Math.min(99, ((Date.now() - startTime) / (checkInterval * 100)) * 100)
      progressBar(percent, startTime)
    }
  }, checkInterval)

  // 执行异步任务
  try {
    const result = await fn()
    taskFinished = true // 标志任务完成
    return result
  }
  finally {
    // 清除定时器并设置进度条到 100%
    clearInterval(interval)
    progressBar(100, startTime)
    // eslint-disable-next-line no-console
    console.log('\n任务完成')
  }
}
