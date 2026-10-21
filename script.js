const packagesWeight = [2.5, 70.5, 6.8, 0.5, 50, 11.2];

function findHeaviestPackage(arr) {
    return Math.max(...arr);
}

function filterHeavyPackages(arr) {
    return arr.filter(weight => weight > 5);
}

function calculateTotalWeight(arr) {
    return arr.reduce((sum, weight) => sum + weight, 0);
}

const userName = promt("Пожалуйста, введите ваше имя:");

const totalWeight = calculateTotalWeight(packagesWeight);
const heavyPackages = filterHeavyPackages(packagesWeight);
const heavyWeight = calculateTotalWeight(heavyPackages);

let lightCount = 0;
for (let i = 0; i < packagesWeight.length; i++) {
    if (packagesWeight[i] <= 2) {
        lightCount++;
    }
}

const lightPercentage = (lightCount / packagesWeight.length) * 100;


alert(`Привет, ${userName}! Общий вес груза – 
    ${totalWeight.toFixed(1)} кг, из них 
    ${heavyWeight.toFixed(1)} кг – тяжёлые посылки.`);

console.log(`Доля лёгких посылок: ${lightPercentage.toFixed(1)}%`);
console.log(`Количество лёгких посылок: ${lightCount} шт.`);

if (totalWeight > 50) {
    console.log("Требуется помощь второго курьера");
} else {
    console.log("Курьер справится сам.");
}