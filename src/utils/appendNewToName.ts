export default function appendNewToName(name: string) {
  const newName = name.substring(0, name.length).concat("-new");
  return newName;
}
