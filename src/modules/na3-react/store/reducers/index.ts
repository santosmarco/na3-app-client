import { combineReducers } from "redux";

import { authReducer } from "./auth";
import { configReducer } from "./config";
import { departmentsReducer } from "./departments";
import { globalReducer } from "./global";
import { labelTemplatesReducer } from "./labelTemplates";
import { maintProjectsReducer } from "./maintProjects";
import { na3PeopleReducer } from "./na3/people";
import { na3ProductsReducer } from "./na3/products";
import { na3UsersReducer } from "./na3/users";
import { serviceOrdersReducer } from "./serviceOrders";
import { stdDocsReducer } from "./stdDocs";

export const rootReducer = combineReducers({
  auth: authReducer,
  config: configReducer,
  departments: departmentsReducer,
  global: globalReducer,
  labelTemplates: labelTemplatesReducer,
  maintProjects: maintProjectsReducer,
  na3People: na3PeopleReducer,
  na3Products: na3ProductsReducer,
  na3Users: na3UsersReducer,
  serviceOrders: serviceOrdersReducer,
  stdDocs: stdDocsReducer,
});
