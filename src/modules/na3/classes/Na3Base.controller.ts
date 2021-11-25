import axios from "axios";

import type { Na3ApiData, Na3ApiResponse } from "../../na3-types";

export abstract class Na3BaseController {
  private _api = axios.create({
    baseURL:
      "https://us-central1-nova-a3-ind.cloudfunctions.net/api/rest/novaa3/",
    headers: { "Content-Type": "application/json" },
  });

  protected async getApi<T extends Na3ApiData>(
    endpoint: `/${string}`
  ): Promise<Na3ApiResponse<T>> {
    const { data } = await this._api.get<Na3ApiResponse<T>>(endpoint);
    return data;
  }
}
