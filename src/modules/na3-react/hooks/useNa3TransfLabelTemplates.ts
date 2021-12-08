import type { FirebaseError } from "@modules/firebase-errors-pt-br";
import { translateFirebaseError } from "@modules/firebase-errors-pt-br";
import type { Na3TransfLabelTemplate } from "@modules/na3-types";
import { addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useCallback, useRef } from "react";

import type {
  FirebaseDocOperationResult,
  FirebaseNullOperationResult,
} from "../types";
import { getCollection } from "../utils";
import { useCurrentUser } from "./useCurrentUser";
import { useStateSlice } from "./useStateSlice";

export type UseNa3TransfLabelTemplatesResult = {
  data: Na3TransfLabelTemplate[] | null;
  error: FirebaseError | null;
  helpers: {
    add: (
      templateData: Omit<Na3TransfLabelTemplate, "id">
    ) => Promise<
      FirebaseDocOperationResult<Omit<Na3TransfLabelTemplate, "id">>
    >;
    delete: (templateId: string) => Promise<FirebaseNullOperationResult>;
    getById: (id: string) => Na3TransfLabelTemplate | undefined;
    getUserTemplates: (
      data?: Na3TransfLabelTemplate[]
    ) => Na3TransfLabelTemplate[];
    update: (
      templateId: string,
      templateData: Omit<Na3TransfLabelTemplate, "id">
    ) => Promise<FirebaseDocOperationResult<Na3TransfLabelTemplate>>;
  };
  loading: boolean;
};

export function useNa3TransfLabelTemplates(): UseNa3TransfLabelTemplatesResult {
  const { environment } = useStateSlice("config");
  const { transf: transfLabelTemplates } = useStateSlice("labelTemplates");

  const user = useCurrentUser();

  const fbCollectionRef = useRef(
    getCollection("transf-label-templates", environment)
  );

  const getById = useCallback(
    (id: string): Na3TransfLabelTemplate | undefined =>
      transfLabelTemplates.data?.find((template) => template.id === id),
    [transfLabelTemplates.data]
  );

  const getUserTemplates = useCallback(
    (data?: Na3TransfLabelTemplate[]): Na3TransfLabelTemplate[] => {
      const dataConsidered = [...(data || transfLabelTemplates.data || [])];

      if (!user) {
        return [];
      } else if (user.hasPrivileges("labels_transf_print_all")) {
        return dataConsidered;
      } else if (user.hasPrivileges("labels_transf_print_own")) {
        return dataConsidered.filter(
          (template) =>
            template.departmentId === null ||
            user.includesDepartments(template.departmentId)
        );
      }
      return [];
    },
    [user, transfLabelTemplates.data]
  );

  const add = useCallback(
    async (templateData: Omit<Na3TransfLabelTemplate, "id">) => {
      try {
        const docRef = await addDoc(fbCollectionRef.current, templateData);
        return { data: docRef, error: null };
      } catch (err) {
        return {
          data: null,
          error: translateFirebaseError(err as FirebaseError),
        };
      }
    },
    []
  );

  const update = useCallback(
    async (
      templateId: string,
      templateData: Omit<Na3TransfLabelTemplate, "id">
    ) => {
      try {
        const docRef = doc(fbCollectionRef.current, templateId);
        await updateDoc(docRef, templateData);
        return { data: docRef, error: null };
      } catch (err) {
        return {
          data: null,
          error: translateFirebaseError(err as FirebaseError),
        };
      }
    },
    []
  );

  const del = useCallback(async (templateId: string) => {
    try {
      await deleteDoc(doc(fbCollectionRef.current, templateId));
      return { error: null };
    } catch (err) {
      return { error: translateFirebaseError(err as FirebaseError) };
    }
  }, []);

  return {
    ...transfLabelTemplates,
    helpers: { add, delete: del, getById, getUserTemplates, update },
  };
}
