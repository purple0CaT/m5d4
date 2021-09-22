export const converString = (value) => {
  let arr = value
    .replace(/,/g, " ")
    .replace(/:/g, " ")
    .replace("{", "")
    .replace("}", "")
    .replace(/"/g, "")
    .split(" ");
  arr = arr.filter((ar) => ar != "");
  if (arr.length > 4) {
    arr[arr.length - 2] = `${arr[arr.length - 2]}:${arr[arr.length - 1]}`;
    arr.pop();
  }
  let newApendObj = {};
  for (let i = 0; i < arr.length; i += 2) {
    newApendObj[arr[i]] = arr[i + 1];
  }
  return newApendObj;
};
