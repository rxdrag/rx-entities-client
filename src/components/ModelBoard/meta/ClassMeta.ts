import { AttributeMeta } from "./AttributeMeta";

/**
 * 实体类型枚举，目前仅支持普通实体跟枚举实体，
 * 枚举实体类似语法糖，不映射数据库，
 * 枚举类型的字段映射到数据库是sttring类型
 */
export enum StereoType {
  Enum = "Enum",
  Interface = "Interface",
  Abstract = "Abstract",
  ValueObject = "ValueObject",
  Entity = "Entity",
  GQLInterface = "GQLInterface",
}

/**
 * 实体元数据
 */
export interface ClassMeta {
  /**
   * 唯一标识
   */
  uuid: string;

  innerId: number;

  name: string;

  stereoType: StereoType;

  attributes: AttributeMeta[];

  /**
   * 枚举值JSON，枚举类型实体使用，不参与数据库映射
   */
  enumValues?: any;

  root?: boolean;

  description?: string;
}
