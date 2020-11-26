// import {mul} from './Utils'
/**
 * 存储localStorage
 */
export const setlocalStorage = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getlocalStorage = name => {
  if (!name) return;
  return window.localStorage.getItem(name);
};
/**
 * 删除localStorage
 */
export const removelocalStorage = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
};


/**
 * 存SessionStorage
 */
export const setSessionStorage = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.sessionStorage.setItem(name, content);
};

/**
 * 获取SessionStorage
 */
export const getSessionStorage = name => {
  if (!name) return;
  return window.sessionStorage.getItem(name);
};

/**
 * 删除SessionStorage
 */
export const removeSessionStorage = name => {
  if (!name) return;
  window.sessionStorage.removeItem(name);
};

/**
 * 是否为空
 * @param value 值
 */
export const isEmpty = value => {
  return value == null || typeof value === 'string' && value.length === 0;
};

/**
 * 是否不为空
 * @param value 值
 */
export const constisNotEmpty = value => {
  return !Utils.isEmpty(value);
};

/**
 * 是否数组
 * @param vaue 值
 */
export const isArray = value => {
  return Array.isArray(value);
};

/**
 * 是否对象
 * @param vaue 值
 */
export const isObject = () => {
  return typeof value === 'object' && !Utils.isArray(value);
};

/**
 * 加
 *
 */
export const add = (a, b) => {
  let c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
};

/**
 * 乘
 *
 */
export const mul = (a, b) => {
  let c = 0,
    d = a.toString(),
    e = b.toString();
  try {
    c += d.split(".")[1].length;
  } catch (f) {
  }
  try {
    c += e.split(".")[1].length;
  } catch (f) {
  }
  return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
};
/**
 * 减
 *
 */
export const sub = (a, b) => {
  let c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
};

/**
 * 除
 *
 */
export const div = (a, b) => {
  let c, d, e = 0,
    f = 0;
  try {
    e = a.toString().split(".")[1].length;
  } catch (g) {
  }
  try {
    f = b.toString().split(".")[1].length;
  } catch (g) {
  }
  return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
};

// * @param data 类型判断
export const typeOf = (obj) => {
  const toString = Object.prototype.toString;
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  };
  return map[toString.call(obj)];
};


//    深复制
export const deepCopy = (oldObj) => {
  let newObj = oldObj instanceof Array ? [] : {};
  for (let key in oldObj) { // oldobj是数组 key 为索引，是对象为属性值
    // 判断值是否是原始类型
    if (typeof oldObj[key] !== 'object') {
      newObj[key] = oldObj[key];
    } else {
      newObj[key] = deepCopy(oldObj[key]);
    }
  }
  return newObj;
}
