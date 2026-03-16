
console.log("Program started");
const firstPromise = new Promise((resolve) => {
  setTimeout(() => {
    resolve("Step 1 complete");
  }, 3000);
});
console.log(firstPromise);
console.log("Program in progress...");
firstPromise
  .then((value) => {
    console.log(value); 

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Step 2 complete");
      }, 3000);
    });
  })

  .then((value2) => {
    console.log(value2);
  });