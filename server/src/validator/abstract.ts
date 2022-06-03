import { GameDataValidationError } from '../app/exceptions'

class AbstractValidator {
  protected _validateString(val: string, msg: string, allowBlank: boolean = false): void {
    if ((!val && !allowBlank) || typeof val !== 'string') {
      throw new GameDataValidationError(msg)
    }
  }

  protected _validateNumber(val: number, min: number, max: number, msg: string): void {
    if (!val || typeof val !== 'number') {
      throw new GameDataValidationError(msg)
    }

    if (val < min || val > max) {
      throw new GameDataValidationError(msg)
    }
  }

  protected _validateBoolean(val: boolean, msg: string): void {
    if (![ true, false ].includes(val)) {
      throw new GameDataValidationError(msg)
    }
  }
}

export {
  AbstractValidator
}

