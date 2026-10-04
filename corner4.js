const user = {
  ism: "ALi",
  yosh: 0,
  shahar: "Toshkent",
  manzil: null,
};

// 1. 'ism" va qolgan barcha maydonlarni ajratib oling (rest)
//  2. yosh || 18" va 'yosh ?? 18" fargini konsolga chiqaring
//  3 'user. manzil? kocha' - nima qaytaradi?
// // 4. Ikkita obyektni birlashtiring (spread bilan)

//2
const { ism, ...userRest } = user;
console.log(ism);
console.log(userRest);
//2
console.log(user.yosh || 18); // 0 || 18 => 18
console.log(user.yosh ?? 18); // 0 ?? 18 => 0
//3
console.log(user.manzil?.kocha); // undefined
//4
const lazyUser = { ishi: "bekarchi", kasbi: "faqatUxlash" };
const spreadUser = { ...user, ...lazyUser };
console.log(spreadUser);
