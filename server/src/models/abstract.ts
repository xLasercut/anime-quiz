import { GameDataValidationError } from '../app/exceptions';
import { ObjectSchema, ValidationResult } from 'joi';

abstract class AbstractModel<T> {
  protected _schema: ObjectSchema;
  protected _result: ValidationResult<T>;

  protected constructor(schema: ObjectSchema, item: T) {
    this._schema = schema;
    this._result = this._schema.validate(item);
    if (this._result.error) {
      throw new GameDataValidationError(this._result.error.details[0].message);
    }
  }

  public dict(): T {
    return this._result.value;
  }

  protected _jsonParseList(jsonString: string): string[] {
    try {
      const parsed = JSON.parse(jsonString);
      return parsed.filter((item) => item !== null);
    } catch {
      return [];
    }
  }
}

export { AbstractModel };
