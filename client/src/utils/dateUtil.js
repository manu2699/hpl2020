export default (date) => {
  var d = new Date(date);
  return `${d.getHours()}:${d.getMinutes()}, ${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
}
