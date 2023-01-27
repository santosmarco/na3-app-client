import type { FirebaseError } from "@modules/firebase-errors-pt-br";
import translateFirebaseError from "@modules/firebase-errors-pt-br";
import type { Product } from "@schemas";
import { addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useCallback, useRef } from "react";

import type {
  FirebaseNullOperationResult,
  FirebaseOperationResult,
} from "../types";
import { buildNa3Error, getCollection } from "../utils";
import { useEnv } from "./useEnv";
import { useNa3Users } from "./useNa3Users";
import { useStateSlice } from "./useStateSlice";

export type useNa3NativeProductsResult = {
  data: Array<Product & { id: string }> | null;
  error: FirebaseError | null;
  helpers: {
    createProduct: (
      data: Product
    ) => Promise<FirebaseOperationResult<Product & { id: string }>>;
    deleteProduct: (id: string) => Promise<FirebaseNullOperationResult>;
    editProduct: (
      id: string,
      data: Product & { id?: string }
    ) => Promise<FirebaseOperationResult<Product & { id: string }>>;
  };
  loading: boolean;
};

export function useNa3NativeProducts(): useNa3NativeProductsResult {
  const environment = useEnv();
  const products = useStateSlice("products");

  const { currentUser } = useNa3Users();

  const fbCollectionRef = useRef(getCollection("products", environment));

  const createProduct = useCallback(
    async (
      data: Product
    ): Promise<FirebaseOperationResult<Product & { id: string }>> => {
      if (!currentUser) {
        return {
          data: null,
          error: buildNa3Error("na3/firestore/generic/user-not-found"),
        };
      }

      try {
        const docRef = await addDoc(fbCollectionRef.current, data);
        const addedDocument = { ...data, id: docRef.id };
        return { data: addedDocument, error: null };
      } catch (err) {
        return {
          data: null,
          error: translateFirebaseError(err as FirebaseError),
        };
      }
    },
    [currentUser]
  );

  const editProduct = useCallback(
    async (
      id: string,
      data: Product & { id?: string }
    ): Promise<FirebaseOperationResult<Product & { id: string }>> => {
      if (!currentUser) {
        return {
          data: null,
          error: buildNa3Error("na3/firestore/generic/user-not-found"),
        };
      }

      const { id: _id, ...rest } = data;

      try {
        await updateDoc(doc(fbCollectionRef.current, id), rest);
        const updatedDocument = { ...data, id };
        return { data: updatedDocument, error: null };
      } catch (err) {
        return {
          data: null,
          error: translateFirebaseError(err as FirebaseError),
        };
      }
    },
    [currentUser]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      if (!currentUser) {
        return {
          data: null,
          error: buildNa3Error("na3/firestore/generic/user-not-found"),
        };
      }

      try {
        await deleteDoc(doc(fbCollectionRef.current, id));
        return { error: null };
      } catch (err) {
        return { error: translateFirebaseError(err as FirebaseError) };
      }
    },
    [currentUser]
  );

  return {
    ...products,
    helpers: {
      createProduct,
      editProduct,
      deleteProduct,
    },
  };
}
