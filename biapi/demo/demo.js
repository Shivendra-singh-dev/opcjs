// function setup(arg){
//     for(var i=0; i<arg.length; i++){
//         console.log("Start : "+i);
//     }
// }

// setup([1,3,6,7,8,1,5]);

// const people = [
//   { name: "Alice", age: 20, city: "New York" },
//   { name: "Bob", age: 30, city: "Los Angeles" },
//   { name: "Charlie", age: 20, city: "New York" },
//   { name: "Shivan", age: 30, city: "Chicago" },
//   { name: "Shiv87", age: 40, city: "Los Angeles" }
// ];

// const grouped = Object.groupBy(people, person => person.city);

// console.log(grouped);

// const result = Map.groupBy(
//   [1, 2, 3, 4],
//   x => x % 2 === 0 ? "even" : "odd"
// );

// console.log(Map.groupBy);

// const result = [1, 2, 3, 4].reduce((map, x) => {
//   const key = x % 2 === 0 ? "even" : "odd";

//   if (!map.has(key)) {
//     map.set(key, []);
//   }

//   map.get(key).push(x);
//   return map;
// }, new Map());

// console.log(result);

// const result = Object.groupBy(
//   [1, 2, 3, 4],
//   x => (x % 2 === 0 ? "even" : "odd")
// );

// console.log(result);

// function arg(arg){
//     for(var i=0;i<arg.length;i++){
//         console.log('hiii : '+arg[i])
//     }
// }

// arg([1,4,57,8,3,5,6])