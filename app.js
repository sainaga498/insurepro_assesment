

// Reading text file using fs module

const fs = require("fs");

fs.readFile('sales.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log(`err reading file: `,err)
        return 
    } else data


// splitting sales file content into lines
const sales = data.trim().split('\n');

const salesData = sales.slice(1);


// 1. total sales data

let totalSales = 0;

salesData.forEach(sale => {
const items = sale.split(',');
const totalPrice = parseFloat(items[4]);
totalSales += totalPrice;
});
console.log(`1. Total sales of store`)
console.log(totalSales)


// 2. Month wise sales
const monthsales = data.trim().split('\n');

const monthData = monthsales.slice(1);
const salesOfMonth = {};

monthData.forEach((eachMonth, sku, quantity) => {
    const months = eachMonth.split(',');
    const date = months[0];
    const totalPrice = parseFloat(months[4]);

    const month = date.slice(0, 7)

    if(!salesOfMonth[month]) {
       salesOfMonth[month] = 0;
    }
    salesOfMonth[month] += totalPrice
});
console.log(`2. Month wise sales`)
console.log(salesOfMonth)

// 3. Most popular Item in each month

const rowsData = data.trim().split('\n'); 
const saleData = rowsData.map(item => {
  const [date, sku, quantity, totalPrice ] = item.split(',');
  return {
    date: date.trim(),
    sku: sku.trim(),
    quantity: parseInt(quantity.trim()),
    totalPrice: parseFloat(totalPrice.trim()),
  };
});

// sales by month and SKU
const mostsalesByMonth = {};
saleData.forEach(({ date, sku, quantity }) => {
  const month = date.slice(0, 7);
  if (!mostsalesByMonth[month]) {
    mostsalesByMonth[month] = {};
  }
  if (!mostsalesByMonth[month][sku]) {
    mostsalesByMonth[month][sku] = 0;
  }
  mostsalesByMonth[month][sku] += quantity;
});

// popular item by quantity for each month
const mostPopularItems = {};
Object.keys(mostsalesByMonth).forEach(month => {
  let maxQuantity = 0;
  let popularItem = '';
  Object.entries(mostsalesByMonth[month]).forEach(([sku, quantity]) => {
    if (quantity > maxQuantity) {
      maxQuantity = quantity;
      popularItem = sku;
    }
  });
  mostPopularItems[month] = { item: popularItem, quantity: maxQuantity };
});

console.log(`3.The most popular item`)
console.log(mostPopularItems);

// 4  Items generating most revenue in each month.
const revenueMonth = {};
saleData.forEach(({ date, sku, totalPrice }) => {
  const months = date.slice(0, 7);
  if (!revenueMonth[months]) {
    revenueMonth[months] = {};
  }
  if (!revenueMonth[months][sku]) {
    revenueMonth[months][sku] = 0;
  }
  revenueMonth[months][sku] += totalPrice;
});

// the item generating the most revenue for each month
const topRevenueItems = {};
Object.keys(revenueMonth).forEach(month => {
  let maxRevenue = 0;
  let topItem = '';
  Object.entries(revenueMonth[month]).forEach(([sku, revenue]) => {
    if (revenue > maxRevenue) {
      maxRevenue = revenue;
      topItem = sku;
    }
  });
  topRevenueItems[month] = { item: topItem, revenue: maxRevenue };
});

// Output the result
console.log("4.Top revenue-generating item by month:");
console.log(topRevenueItems);

//5  For the most popular item, find the min, max and average number of orders each month.

const quantityByMonth = {};
saleData.forEach(({ date, sku, quantity }) => {
  const month = date.slice(0, 7); // "YYYY-MM" format for month
  if (!quantityByMonth[month]) {
    quantityByMonth[month] = {};
  }
  if (!quantityByMonth[month][sku]) {
    quantityByMonth[month][sku] = [];
  }
  quantityByMonth[month][sku].push(quantity);
});

const popularItemStats = {};
Object.keys(quantityByMonth).forEach(month => {
  let maxQuantity = 0;
  let mostPopularItem = '';
  
  //  most popular item based on total quantity sold
  Object.entries(quantityByMonth[month]).forEach(([sku, quantities]) => {
    const totalQuantity = quantities.reduce((acc, qty) => acc + qty, 0);
    if (totalQuantity > maxQuantity) {
      maxQuantity = totalQuantity;
      mostPopularItem = sku;
    }
  });

  // Calculate min, max, and average for the most popular item in the month
  if (mostPopularItem) {
    const quantities = quantityByMonth[month][mostPopularItem];
    const minQuantity = Math.min(...quantities);
    const maxQuantity = Math.max(...quantities);
    const avgQuantity = quantities.reduce((acc, qty) => acc + qty, 0) / quantities.length;

    popularItemStats[month] = {
      item: mostPopularItem,
      minQuantity,
      maxQuantity,
      avgQuantity: avgQuantity.toFixed(2),
    };
  }
});


console.log("5. Most popular item statistics by month:");
console.log(popularItemStats);
});