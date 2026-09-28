const   kitoblar =[
    {id: 1, nomi: '0tkan kunlar', sahifa: 400, oqilgan: true },
    {id: 2, nomi: "Mehrobdan chayon", sahifa: 320, oqilgan: false },
    {id: 3, nomi: 'kecha va kunduz', sahifa: 280, oqilgan: true },
    {id: 4, nomi: 'sarob', sahifa: 500, oqilgan: false },
]
const oqilganKitoblar = kitoblar.filter((kitob) => kitob.oqilgan === true)
console.log(oqilganKitoblar)

const UmumiySahifasi = kitoblar.reduce((umumiy, kitob) => umumiy + kitob.sahifa, 0)
console.log(UmumiySahifasi)

const FindId = kitoblar.find((kitob) => kitob.id === 3)
console.log(FindId)

const kitobNomi = kitoblar.map ((kitob)=>kitob.nomi)
console.log(kitobNomi)
const kitobSahifa = kitoblar.map ((kitob)=>`${kitob.nomi} kitobining sahifasi ${kitob.sahifa} ta`)
console.log(kitobSahifa)
