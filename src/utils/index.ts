import {CheckType} from "./checkType";

/**
 * @name: 深拷贝
 * @description:
 * @param {type} v any 被拷贝的数据
 * @return {type} any 返回拷贝后的数据
 */

export function deepClone<T = any>(v: T): T {
  if (!CheckType.isObject(v) && !CheckType.isArray(v)) {
    return v
  }
  let result: any = {}
  CheckType.isObject(v) ? result = {} : result = []
  for (const key in v) {
    result[key] = deepClone((v[key]))
  }
  return result as T
}
