import EventEmitter from "events";
import type {
  DocumentReference,
  DocumentSnapshot,
  UpdateData,
} from "firebase/firestore";
import { getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import type { Promisable } from "type-fest";

import type {
  TransformerData,
  TransformerOptions,
  TransformerRefreshOptions,
  TransformerResultFail,
  TransformerResultOk,
  TransformerSetDataOptions,
  ValidDocumentSnapshot,
} from "../../types";
import { TransformerError } from "../errors/TransformerError";

export class Transformer<T extends TransformerData> {
  private readonly eventManager = new EventEmitter();

  constructor(
    private _data: T,
    private _ref: DocumentReference<T>,
    private readonly _options?: TransformerOptions<T>
  ) {
    this.attachOnSnapshotListener();
  }

  get data(): T {
    return this._data;
  }
  private set data(data: T) {
    this._data = data;
  }

  get ref(): DocumentReference<T> {
    return this._ref;
  }
  private set ref(ref: DocumentReference<T>) {
    this._ref = ref;
  }

  onSnapshot(listener: (data: this) => Promisable<void>): void {
    this.eventManager.on("snapshot", (...args) => {
      if (args[0] === this) {
        void listener(args[0]);
      } else {
        void listener(this);
      }
    });
  }

  protected refresh(
    docSnapshot: DocumentSnapshot<T>,
    options?: TransformerRefreshOptions<T>
  ): this {
    if (!this.validateDocSnapshot(docSnapshot)) {
      throw new TransformerError("general/doc-not-found");
    }

    this.setDataFromSnapshot(docSnapshot, options).setRefFromSnapshot(
      docSnapshot
    );

    return this;
  }

  protected async refreshAsync(
    options?: TransformerRefreshOptions<T>
  ): Promise<this> {
    const docSnapshot = await getDoc(this.ref);

    return this.refresh(docSnapshot, options);
  }

  protected async updateAsync(data: UpdateData<T>): Promise<this> {
    await updateDoc(this.ref, data);
    await this.refreshAsync();

    return this;
  }

  protected buildResultOk<T>(data: T): TransformerResultOk<T> {
    return { error: null, data };
  }

  protected buildResultFail(error: TransformerError): TransformerResultFail {
    return { error, data: null };
  }

  protected handleResultError(error: unknown): TransformerResultFail {
    const transformerError = TransformerError.handleError(error);
    return { error: transformerError, data: null };
  }

  private attachOnSnapshotListener(): void {
    onSnapshot(this.ref, (docSnapshot): void => {
      const refreshed = this.refresh(docSnapshot);
      this.eventManager.emit("snapshot", refreshed);
    });
  }

  private setDataFromSnapshot(
    docSnapshot: ValidDocumentSnapshot<T>,
    options?: TransformerSetDataOptions<T>
  ): this {
    const docData = docSnapshot.data();
    const docIdField = options?.idField || this._options?.idField;

    this.data = {
      ...docData,
      ...(docIdField ? { [docIdField]: docSnapshot.id } : {}),
    };

    return this;
  }

  private setRefFromSnapshot(docSnapshot: ValidDocumentSnapshot<T>): this {
    this.ref = docSnapshot.ref;

    return this;
  }

  private validateDocSnapshot(
    docSnapshot: DocumentSnapshot<T>
  ): docSnapshot is ValidDocumentSnapshot<T> {
    if (!docSnapshot.exists()) {
      return false;
    }
    return true;
  }
}
