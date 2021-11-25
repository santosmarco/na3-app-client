import type { BatchId, BatchIdType } from "../types";

export class Na3BatchId implements BatchId {
  readonly originalValue: string;

  private _value: string;
  private _type: BatchIdType = "invalid";
  private _hasBeenFixed = false;
  private _isBrazilian = false;
  private _isMexican = false;
  private _isCommercial = false;
  private _isValid = false;

  constructor(value: string) {
    this.originalValue = value;
    this._value = value;

    if (this.validateBrazilian()) {
      this.initialize("brazil");
      return;
    }
    if (this.validateMexican()) {
      this.initialize("mexico");
      return;
    }
    if (this.validateCommercial()) {
      this.initialize("commercial");
      return;
    }

    this._value = this.fixAgainstFormat("brazil");
    if (this.validateBrazilian()) {
      this.initialize("brazil", { fixed: true });
      return;
    }

    this._value = this.fixAgainstFormat("mexico");
    if (this.validateMexican()) {
      this.initialize("mexico", { fixed: true });
      return;
    }

    this._value = this.fixAgainstFormat("commercial");
    if (this.validateCommercial()) {
      this.initialize("commercial", { fixed: true });
      return;
    }
  }

  get value(): string {
    return this._value;
  }
  private set value(value: string) {
    this._value = value;
  }

  get type(): BatchIdType {
    return this._type;
  }
  private set type(type: BatchIdType) {
    this._type = type;
  }

  get hasBeenFixed(): boolean {
    return this._hasBeenFixed;
  }
  private set hasBeenFixed(hasBeenFixed: boolean) {
    this._hasBeenFixed = hasBeenFixed;
  }

  get isBrazilian(): boolean {
    return this._isBrazilian;
  }
  private set isBrazilian(isBrazilian: boolean) {
    this._isBrazilian = isBrazilian;
  }

  get isMexican(): boolean {
    return this._isMexican;
  }
  private set isMexican(isMexican: boolean) {
    this._isMexican = isMexican;
  }

  get isCommercial(): boolean {
    return this._isCommercial;
  }
  private set isCommercial(isCommercial: boolean) {
    this._isCommercial = isCommercial;
  }

  get isValid(): boolean {
    return this._isValid;
  }
  private set isValid(isValid: boolean) {
    this._isValid = isValid;
  }

  private initialize(type: BatchIdType, options?: { fixed: boolean }): void {
    this.type = type;
    this.isBrazilian = type === "brazil";
    this.isMexican = type === "mexico";
    this.isCommercial = type === "commercial";
    this.isValid = type !== "invalid";
    this.hasBeenFixed = !!options?.fixed;
  }

  private fixAgainstFormat(format: Exclude<BatchIdType, "invalid">): string {
    switch (format) {
      case "brazil":
        return (
          this.originalValue.substring(0, 4) +
          "-" +
          this.originalValue.substring(4, 7) +
          "-" +
          this.originalValue.substring(7, 12) +
          " " +
          this.originalValue.substring(12)
        );
      case "mexico":
        return this.originalValue.replace(
          /*
           * $1: Department's two-letter ID (KA only)
           * $2: Product's two-letter ID (NT or CI)
           * $3: Batch's sequential number
           * $4: Shift (A-G)
           */
          /^(ka)(nt|ci)(\d{4})([a-g])$/i,
          "$1-$2-$3 $4"
        );
      case "commercial":
        return this.originalValue.replace(
          /*
           * $1: Department's two-letter ID
           * $2: Production Order's number
           * $3: Year (first two digits)
           * $4: Shift (A-G)
           */
          /^([c-fikr][a-dfgk-mx])(\d{3})([2-4]\d)([a-g])$/i,
          "$1-$2-$3 $4"
        );
      default:
        return this.originalValue;
    }
  }

  private validateBrazilian(): boolean {
    return /^([c-fikr][a-dfgk-mx][0-3]\d-\d{3}-[2-4]\d[0-3]\d{2} [a-g])$/i.test(
      this.value
    );
  }

  private validateMexican(): boolean {
    return /^(ka-((nt)|(ci))-\d{4} [a-g])$/i.test(this.value);
  }

  private validateCommercial(): boolean {
    return /^([c-fikr][a-dfgk-mx]-\d{3}-[2-4]\d [a-g])$/i.test(this.value);
  }
}
