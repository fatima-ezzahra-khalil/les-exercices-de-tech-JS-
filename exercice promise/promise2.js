// 1️⃣ Print out "Program started"
console.log("Program started");

// 2️⃣ Create a Promise that resolves after 3 seconds
//    and rejects after 2 seconds
const myPromise = new Promise((resolve, reject) => {

  setTimeout(() => {
    reject("Program failure");
  }, 2000);

  setTimeout(() => {
    resolve("Program complete");
  }, 3000);

});

// 3️⃣ Log out the promise while it's pending
console.log(myPromise);

// 4️⃣ Print out "Program in progress..."
console.log("Program in progress...");

// 5️⃣ & 6️⃣ Handle fulfill and reject
myPromise
  .then((message) => {
    console.log(message); // if resolved
  })
  .catch((error) => {
    console.log(error); // if rejected
  });