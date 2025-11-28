export type SampleRecipe = {
  id: string;
  title: string;
  time: string; // e.g., "25 perc"
  tag: string;  // e.g., "könnyű", "desszert"
  description: string;
  gradientFrom: string; // hex
  gradientTo: string;   // hex
};

export const sampleRecipes: SampleRecipe[] = [
  {
    id: '1',
    title: 'Krémes fokhagymás csirke',
    time: '25 perc',
    tag: 'egytálétel',
    description: 'Selymes fokhagymás mártásban párolt csirke, gyors vacsorához.',
    gradientFrom: '#F4DDDC',
    gradientTo: '#BD95A4',
  },
  {
    id: '2',
    title: 'Mediterrán tésztasaláta',
    time: '20 perc',
    tag: 'könnyű',
    description: 'Olivabogyó, paradicsom és feta – friss, üde ízek.',
    gradientFrom: '#BD95A4',
    gradientTo: '#A1836C',
  },
  {
    id: '3',
    title: 'Csokis brownie',
    time: '35 perc',
    tag: 'desszert',
    description: 'Kívül roppanós, belül krémes csoda.',
    gradientFrom: '#A1836C',
    gradientTo: '#755463',
  },
  {
    id: '4',
    title: 'Zöldborsókrémleves',
    time: '18 perc',
    tag: 'leves',
    description: 'Selymes, mentás zöldborsó, pirított magokkal.',
    gradientFrom: '#F4DDDC',
    gradientTo: '#A1836C',
  },
  {
    id: '5',
    title: 'Sütőtökös gnocchi zsályával',
    time: '30 perc',
    tag: 'vegetáriánus',
    description: 'Vajas-zsályás öntet, őszi ízekkel.',
    gradientFrom: '#BD95A4',
    gradientTo: '#755463',
  },
  {
    id: '6',
    title: 'Csirke tikka masala',
    time: '40 perc',
    tag: 'indiai',
    description: 'Illatos, paradicsomos szószban párolt csirke.',
    gradientFrom: '#F4DDDC',
    gradientTo: '#554040',
  },
  {
    id: '7',
    title: 'Avokádós toast buggyantott tojással',
    time: '10 perc',
    tag: 'reggeli',
    description: 'Gyors, tápláló indítás a naphoz.',
    gradientFrom: '#F4DDDC',
    gradientTo: '#BD95A4',
  },
  {
    id: '8',
    title: 'Ropogós sült karfiol tahinivel',
    time: '35 perc',
    tag: 'vegán',
    description: 'Füstös, citromos tahiniöntettel.',
    gradientFrom: '#BD95A4',
    gradientTo: '#554040',
  },
  {
    id: '9',
    title: 'Citromos-mákos süti',
    time: '45 perc',
    tag: 'desszert',
    description: 'Frissítő, illatos tepsissüti.',
    gradientFrom: '#F4DDDC',
    gradientTo: '#755463',
  },
  {
    id: '10',
    title: 'Gyors wok zöldségekkel',
    time: '15 perc',
    tag: 'könnyű',
    description: 'Ropogós zöldségek, szójaszószos glaze.',
    gradientFrom: '#A1836C',
    gradientTo: '#554040',
  },
  {
    id: '11',
    title: 'Paradicsomos bruschetta',
    time: '12 perc',
    tag: 'előétel',
    description: 'Fokhagymás pirítóson, balzsamecettel.',
    gradientFrom: '#BD95A4',
    gradientTo: '#F4DDDC',
  },
  {
    id: '12',
    title: 'Klasszikus karbonára',
    time: '22 perc',
    tag: 'tészta',
    description: 'Tojás, pecorino, guanciale – krémes és gyors.',
    gradientFrom: '#755463',
    gradientTo: '#554040',
  },
];
