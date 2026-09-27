const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();

async function main(){
    await prisma.place.deleteMany();
    await prisma.place.createMany({
        data:[
            {
    title: "Registon maydoni",
    name: "Registon",
    imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6",
    location: "Samarqand, Registon ko'chasi",
    userId: 1,
    rate: 4.9,
    description: "Markaziy Osiyodagi eng mashhur me'moriy majmua, uchta ulkan madrasadan iborat.",
    whichLanguage: "uz",
    davlat: "O'zbekiston",
    kimBilanBorishKerak: "Oila yoki do'stlar bilan",
  },
  {
    title: "Ichan Qal'a",
    name: "Xiva",
    imageUrl: "https://images.unsplash.com/photo-1590766940554-153e2c1cc6db",
    location: "Xiva shahri, Xorazm viloyati",
    userId: 1,
    rate: 4.7,
    description: "Devor bilan o'ralgan qadimiy shahar, YUNESKO Jahon merosi ro'yxatida.",
    whichLanguage: "uz",
    davlat: "O'zbekiston",
    kimBilanBorishKerak: "Sevgilingiz bilan",
  },
  {
    title: "Taj Mahal",
    name: "Taj Mahal",
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523",
    location: "Agra, Uttar Pradesh",
    userId: 2,
    rate: 5.0,
    description: "Oq marmardan qurilgan hashamatli maqbara, sevgi ramzi sifatida mashhur.",
    whichLanguage: "en",
    davlat: "Hindiston",
    kimBilanBorishKerak: "Turmush o'rtog'ingiz bilan",
  },
  {
    title: "Eyfel minorasi",
    name: "Eiffel Tower",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    location: "Champ de Mars, Parij",
    userId: 2,
    rate: 4.8,
    description: "Parijning ramzi bo'lgan temir minora, kechqurun yorug'lik shousi bilan mashhur.",
    whichLanguage: "fr",
    davlat: "Fransiya",
    kimBilanBorishKerak: "Do'stlar guruhi bilan",
  },
  {
    title: "Buyuk Xitoy devori",
    name: "Great Wall of China",
    imageUrl: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d",
    location: "Badaling, Pekin yaqinida",
    userId: 3,
    rate: 4.9,
    description: "Dunyodagi eng uzun mudofaa inshooti, minglab kilometrga cho'zilgan.",
    whichLanguage: "zh",
    davlat: "Xitoy",
    kimBilanBorishKerak: "Sayohat guruhi bilan",
  },
        ]
    });
    console.log("malumotlar bazaga muvaffaqiyatli qo'shildi");
}
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }) ;
