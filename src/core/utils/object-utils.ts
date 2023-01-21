export class ObjectUtils {
  private constructor() { }

  public static copy(from: any, to: any): void {
    for (const key in from) {
      if (Object.prototype.hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }
  }

  public static enumToArray<T>(object: any): T[] {
    const arr: T[] = [];

    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        arr.push(key as any as T);
      }
    }

    return arr;
  }

  public static forInEnum<T>(object: any, callback: (key: T) => void, ctx?: any): void {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        callback.call(ctx, (<T><any>key));
      }
    }
  }

  public static forInObject<K, V>(object: any, callback: (key: K, value: V) => void, ctx?: any): void {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        callback.call(ctx, (<K><any>key), (<V>object[key]));
      }
    }
  }

  public static mapObjectToArray<K, V, I>(object: any, callback: (key: K, value: V) => I, ctx?: any): I[] {
    const result: I[] = [];
    ObjectUtils.forInObject<K, V>(object, function (key, value) {
      result.push(callback.call(ctx, key, value));
    });
    return result;
  }

  public static hashCode(object: any): number {
    const str = object + "";
    const length = str.length;
    let hash = 0;

    for (let i = 0; i < length; i++) {
      const code = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + code;
      hash = hash & hash;
    }

    return hash;
  }

  public static deepEqual(a: any, b: any): boolean {
    if (a === b) {
      return true;
    }

    if ((typeof a === "object" && a !== null) && (typeof b === "object" && b !== null)) {
      if (Object.keys(a).length !== Object.keys(b).length) {
        return false;
      }
  
      for (let prop in a) {
        if (b.hasOwnProperty(prop)) {
          if (!ObjectUtils.deepEqual(a[prop], b[prop])) {
            return false;
          }
        } else {
          return false;
        }
      }
      
      return true;
    }

    return false;
  }
}
