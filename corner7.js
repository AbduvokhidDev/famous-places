const sonlar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const result = sonlar
  .filter((son) => son % 2 === 0)
  .map((son) => son * 2)
  .sort((a, b) => b - a);
console.log(result);

//2 useMemo qachon kerak bo'ladi?\
// xiosblash ogir bolsa.
// kop elementli massiv ni filtir qishil kerak bolsa.

//tasavur qilsak 100 xil tavarni narxini qoshib chiqishimiz kerak bu vaqt oladi,
// Biz useMemo bolsak uni xisoblab yozib daftarga yozib qoyamiz sorashsa uni aytb beramiz faqat
//mahsulot ozgarganda yana qayta xisoblab qoyamiz
