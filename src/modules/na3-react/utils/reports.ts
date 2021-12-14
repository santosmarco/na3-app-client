export function removeSpecialChars(str: string): string {
  const specials =
    "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ".split(
      ""
    );
  const chars = str.split("");

  return chars
    .map((char) => {
      if (specials.includes(char)) {
        return "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr".split(
          ""
        )[specials.findIndex((val) => val === char)];
      } else {
        return char;
      }
    })
    .join("");
}

export function prepareCsvData(
  data: Readonly<Array<Readonly<string[]>>>
): string {
  return data
    .map((row) =>
      row
        .map((cell) => {
          let safeCell = removeSpecialChars(cell);

          if (safeCell.includes(",") || safeCell.includes("\n")) {
            if (safeCell.includes('"')) {
              safeCell = safeCell.replace('"', '\\"');
            }
            safeCell = `"${safeCell}"`;
          }

          return safeCell.trim();
        })
        .join(",")
    )
    .join("\n");
}
