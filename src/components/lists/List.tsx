import { Input } from "antd";
import { nanoid } from "nanoid";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { useId } from "../../hooks";
import { Empty } from "../ui/Empty/Empty";
import { Spinner } from "../ui/Spinner/Spinner";
import { ListEnd } from "./components/ListEnd";
import { ListError } from "./components/ListError";
import { ListLoader } from "./components/ListLoader";
import classes from "./List.module.css";

export type ListProps<
  Item,
  Data extends Item[] | null | undefined = Item[] | null | undefined
> = {
  data: Data;
  error: string | null | undefined;
  filterItem?: Data extends Item[] ? (input: string) => Item[] : never;
  isLoading: boolean;
  isStatic?: boolean;
  renderItem: ListRenderItem<Item>;
  verticalSpacing?: number;
};

export function List<Item extends Record<string, unknown>>({
  data,
  renderItem,
  isLoading,
  error,
  verticalSpacing,
  filterItem,
  isStatic,
}: ListProps<Item>): JSX.Element {
  const listId = useId("list");

  const [loadedData, setLoadedData] = useState<Item[]>([]);

  const [searchInput, setSearchInput] = useState("");

  const handleLoadMore = useCallback(() => {
    if (data) {
      setLoadedData((currLoaded) =>
        currLoaded
          ? [
              ...currLoaded,
              ...data.slice(currLoaded.length, currLoaded.length + 15),
            ]
          : currLoaded
      );
    }
  }, [data]);

  const handleSearchChange = useCallback(
    (eventOrValue: React.ChangeEvent<HTMLInputElement> | string): void => {
      const input =
        typeof eventOrValue === "string"
          ? eventOrValue
          : eventOrValue.target.value;
      setSearchInput(input.toLowerCase());
    },
    []
  );

  const filteredData = useMemo(
    () => (searchInput ? filterItem?.(searchInput) : loadedData),
    [filterItem, searchInput, loadedData]
  );

  useEffect(() => {
    if (data) {
      setLoadedData((currLoaded) => data.slice(0, currLoaded.length || 15));
    }
  }, [data]);

  if (error) {
    return <ListError>{error}</ListError>;
  } else if (isLoading) {
    return <Spinner className={classes.Loading} />;
  } else if (data && filteredData) {
    return (
      <div className={classes.ListContainer}>
        {!!filterItem && (
          <div className={classes.SearchContainer}>
            <Input.Search
              enterButton={true}
              onChange={handleSearchChange}
              onSearch={handleSearchChange}
              placeholder="Pesquisar..."
            />
          </div>
        )}

        <div className={classes.List} id={listId}>
          {filteredData.length === 0 ? (
            <Empty description="Nada para mostrar" />
          ) : (
            <InfiniteScroll
              className={classes.InfiniteScroll}
              dataLength={filteredData.length}
              endMessage={!isStatic && <ListEnd />}
              hasMore={
                !isStatic && !searchInput && filteredData.length < data.length
              }
              loader={<ListLoader />}
              next={handleLoadMore}
              scrollableTarget={listId}
            >
              {filteredData.map((item, index) => (
                <div
                  key={
                    (item instanceof Object &&
                      Object.prototype.hasOwnProperty.call(item, "id") &&
                      typeof item.id === "string" &&
                      item.id) ||
                    nanoid()
                  }
                  style={{
                    marginBottom:
                      index < data.length - 1 &&
                      index === filteredData.length - 1
                        ? 21
                        : verticalSpacing ?? 0,
                    marginTop:
                      index === 0 ? (verticalSpacing || 8) * 1.5 : undefined,
                  }}
                >
                  {renderItem(item)}
                </div>
              ))}
            </InfiniteScroll>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <ListError>
        Um erro inesperado ocorreu. Por favor, atualize a página ou entre em
        contato com o desenvolvedor.
      </ListError>
    );
  }
}

export type ListRenderItem<T> = (item: T) => JSX.Element;
