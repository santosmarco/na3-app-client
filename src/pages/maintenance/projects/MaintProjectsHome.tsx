import {
  ListFormPage,
  MaintCreateProjectForm,
  MaintProjectsList,
} from "@components";
import { useQuery } from "@hooks";
import { useNa3MaintProjects } from "@modules/na3-react/hooks";
import type { Na3MaintenanceProject } from "@modules/na3-types";
import { getMaintProjectsRootUrl } from "@utils";
import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router";

import { MaintProjectDetails } from "./MaintProjectDetails";

type PageProps = {
  isPredPrev: boolean;
};

export function MaintProjectsHomePage({ isPredPrev }: PageProps): JSX.Element {
  const history = useHistory();
  const query = useQuery("id");

  const maintProjects = useNa3MaintProjects();

  const rootUrl = useMemo(
    () => getMaintProjectsRootUrl({ isPredPrev }),
    [isPredPrev]
  );

  const listData = useMemo(
    () =>
      [
        ...maintProjects.helpers.sortByPriority(
          [...maintProjects.helpers.sortByStatus(["running"])].reverse()
        ),
        ...maintProjects.helpers.sortByPriority(
          [...maintProjects.helpers.sortByStatus(["late"])].reverse()
        ),
        ...maintProjects.helpers.sortByStatus(["finished"]),
      ].filter((project) =>
        isPredPrev ? project.isPredPrev : !project.isPredPrev
      ),
    [maintProjects.helpers, isPredPrev]
  );

  const handleCreateProjectClick = useCallback(() => {
    history.push(`${rootUrl}/${isPredPrev ? "nova-predprev" : "novo-projeto"}`);
  }, [history, rootUrl, isPredPrev]);

  const handleSelectProject = useCallback(
    (project: Na3MaintenanceProject) => {
      history.push(`${rootUrl}?id=${project.id}`);
    },
    [history, rootUrl]
  );

  return query.id ? (
    <MaintProjectDetails isPredPrev={isPredPrev} projectId={query.id} />
  ) : (
    <ListFormPage
      actions={[
        {
          label: `${isPredPrev ? "Nova Pred/Prev" : "Novo projeto"}`,
          onClick: handleCreateProjectClick,
        },
      ]}
      description={
        isPredPrev
          ? "Projetos de preditiva/preventiva e lubrificação da Manutenção."
          : undefined
      }
      form={<MaintCreateProjectForm isPredPrev={isPredPrev} />}
      formTitle={`${isPredPrev ? "Nova Pred/Prev" : "Novo Projeto"}`}
      list={
        <MaintProjectsList
          data={listData}
          onSelectProject={handleSelectProject}
        />
      }
      listTitle={`${isPredPrev ? "Pred/Prev" : "Projetos"}`}
      title={`Manutenção • ${isPredPrev ? "Pred/Prev" : "Projetos"}`}
    />
  );
}
