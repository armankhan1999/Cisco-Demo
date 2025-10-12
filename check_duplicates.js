const data = require('./src/source_data/accounts.json');

const grouped = {};
data.forEach(a => {
  const id = a.account.id;
  if (!grouped[id]) grouped[id] = [];
  grouped[id].push({
    name: a.account.name,
    arr: a.account.arr,
    tier: a.account.tier,
    health: a.account.health_score
  });
});

console.log('Total accounts in file:', data.length);
console.log('Unique customer IDs:', Object.keys(grouped).length);
console.log('\nDuplicate customer IDs:\n');

Object.entries(grouped)
  .filter(([id, accounts]) => accounts.length > 1)
  .forEach(([id, accounts]) => {
    console.log(`${id}:`);
    accounts.forEach((a, i) => {
      console.log(`  ${i+1}. ${a.name} - ${a.tier} - $${(a.arr/1000).toFixed(0)}K - Health: ${a.health}`);
    });
    console.log('');
  });
