// 1. Quyidagi funksiyani yozing
function yaratUser(ism, yosh = 18, rol = "user") {
  return { ism, yosh, rol };
}
console.log(yaratUser("ALL"));
console.log(yaratUser("Vali", 25, "admin")); //{ İsm: "Vali", yosh: 25, rol: "admin"}

// // 2. Dinamik obyekt yarating
const maydon = "shahar";
const qiymat = "Toshkent";
// Natija: { shahar: 'Toshkent' }
const dinamikObyekt = { [maydon]: qiymat };
console.log(dinamikObyekt);

// M3. try/catch/finally yozing - fake fetch
async function xavflil() {
  try {
    const javob = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    const data = await javob.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  } finally {
    console.log("Fetch tugadi");
  }
}
xavflil();
