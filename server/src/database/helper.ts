import * as fs from 'fs'

const readFile = (filepath: string): Array<any> => {
  return JSON.parse(fs.readFileSync(filepath, {encoding: 'utf-8'}))
}

const writeFile = (filepath: string, data: Array<any>): void => {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2))
}

const setIntersect = (setA: Set<string>, setB: Set<string>): Set<string> => {
  return new Set(
    [...setA].filter((val: string) => {
      return setB.has(val)
    })
  )
}

const setUnion = (setA: Set<string>, setB: Set<string>): Set<string> => {
  return new Set([...setA, ...setB])
}

const setDifference = (setA: Set<string>, setB: Set<string>): Set<string> => {
  return new Set(
    [...setA].filter((val: string) => {
      return !setB.has(val)
    })
  )
}

export {readFile, writeFile, setUnion, setIntersect, setDifference}
