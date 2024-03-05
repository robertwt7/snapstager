export default function appendNewToName(name: string) {
  const insertPos = name.indexOf(".");
  const newName = name
    .substring(0, insertPos)
    .concat("-new", name.substring(insertPos));
  return newName;
}
