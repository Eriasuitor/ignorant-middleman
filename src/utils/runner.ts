import lodash from 'lodash'

export async function sleep (ms: number): Promise<void> {
  await new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

export async function concurrentRun<T, R> (fn: (args: T) => R, argsList: T[], { concurrency }: {concurrency: number}): Promise<R[]> {
  const result: R[] = Array(argsList.length).fill(null)
  let index = 0
  await Promise.all(
    lodash.range(concurrency).map(async () => {
      while (index < argsList.length) {
        result[index] = await fn(argsList[index++])
      }
    })
  )
  return result
}
