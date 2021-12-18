import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import type { ListStrOptions } from "./text";
import { listStr } from "./text";

type ListStrProps<T> = {
  items: T[];
  options?: ListStrOptions<T>;
};

function ListStr<T extends string>({
  items,
  options,
}: ListStrProps<T>): JSX.Element {
  return <>{listStr(items, options)}</>;
}

let container: Element | null = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
});

afterEach(() => {
  if (!container) {
    return;
  }
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe("listStr", () => {
  test("it should output nothing", () => {
    const items: string[] = [];
    act(() => {
      render(<ListStr items={items} />, container);
    });
    expect(container).toBeEmptyDOMElement();
  });

  test('it should output "a"', () => {
    const items = ["a"];
    act(() => {
      render(<ListStr items={items} />, container);
    });
    expect(container?.textContent).toBe("a");
  });

  test('it should output ["a", "b", "c"] as "a, b e/ou c"', () => {
    const items = ["a", "b", "c"];
    act(() => {
      render(<ListStr items={items} />, container);
    });
    expect(container?.textContent).toBe("a, b e/ou c");
  });

  test('it should output ["a", "b", "c"] as "a, b e c"', () => {
    const items = ["a", "b", "c"];
    act(() => {
      render(
        <ListStr items={items} options={{ connective: "and" }} />,
        container
      );
    });
    expect(container?.textContent).toBe("a, b e c");
  });

  test('it should output ["a", "b", "c"] as "a, b ou c"', () => {
    const items = ["a", "b", "c"];
    act(() => {
      render(
        <ListStr items={items} options={{ connective: "or" }} />,
        container
      );
    });
    expect(container?.textContent).toBe("a, b ou c");
  });

  test('it should output ["a", "b", "c"] as "A, B e C"', () => {
    const items = ["a", "b", "c"];
    act(() => {
      render(
        <ListStr
          items={items}
          options={{
            connective: "and",
            itemTransform: (item): string => item.toUpperCase(),
          }}
        />,
        container
      );
    });
    expect(container?.textContent).toBe("A, B e C");
  });

  test('it should output ["a", "b", "c"] as "A, b ou C" in bold', () => {
    const items = ["a", "b", "c"];

    act(() => {
      render(
        <ListStr
          items={items}
          options={{
            connective: "or",
            itemTransform: (item, idx): React.ReactNode => (
              <strong>{idx !== 1 ? item.toUpperCase() : item}</strong>
            ),
          }}
        />,
        container
      );
    });

    expect(container?.textContent).toBe("A, b ou C");
    expect(container?.children).toHaveLength(3);
    expect(container?.children[0]).toContainHTML(
      "<span><strong>A</strong>, </span>"
    );
    expect(container?.children[1]).toContainHTML(
      "<span><strong>b</strong></span>"
    );
    expect(container?.children[2]).toContainHTML("<strong>C</strong>");
  });
});
