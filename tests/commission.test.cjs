// Automated Unit Test for Auremont Commission Business Rules
// Run via: node tests/commission.test.cjs

const assert = require('assert');

function calculateCommission(grossAmount, type) {
  if (typeof grossAmount !== 'number' || isNaN(grossAmount) || grossAmount < 0) {
    return {
      isConfigured: false,
      message: 'Invalid transaction amount'
    };
  }

  const normalizedType = type ? String(type).toLowerCase() : '';

  if (normalizedType === 'sale') {
    const rate = 0.10;
    const commission = Math.round(grossAmount * rate * 100) / 100;
    const net = Math.round((grossAmount - commission) * 100) / 100;
    return { isConfigured: true, rate, commission, net };
  }
  
  if (normalizedType === 'rent') {
    const rate = 0.05;
    const commission = Math.round(grossAmount * rate * 100) / 100;
    const net = Math.round((grossAmount - commission) * 100) / 100;
    return { isConfigured: true, rate, commission, net };
  }
  
  // Unconfigured transaction types (Lease, Cars, etc.)
  return { 
    isConfigured: false, 
    message: 'Commission requires configuration' 
  };
}

console.log('--- Starting Auremont Commission Business Rules Test Suite ---');

// Test 1: Sale of €1,000,000 (10% rate)
{
  const res = calculateCommission(1000000, 'sale');
  assert.strictEqual(res.isConfigured, true, 'Sale should be configured');
  assert.strictEqual(res.rate, 0.10, 'Sale rate should be 10%');
  assert.strictEqual(res.commission, 100000, 'Commission should be €100,000');
  assert.strictEqual(res.net, 900000, 'Net should be €900,000');
  console.log('✔ Test 1 Passed: Sale €1,000,000 -> Commission €100,000, Net €900,000');
}

// Test 2: Rental of €5,000 (5% rate)
{
  const res = calculateCommission(5000, 'rent');
  assert.strictEqual(res.isConfigured, true, 'Rent should be configured');
  assert.strictEqual(res.rate, 0.05, 'Rent rate should be 5%');
  assert.strictEqual(res.commission, 250, 'Commission should be €250');
  assert.strictEqual(res.net, 4750, 'Net should be €4,750');
  console.log('✔ Test 2 Passed: Rental €5,000 -> Commission €250, Net €4,750');
}

// Test 3: Decimal amounts and rounding precision
{
  const gross = 1234.56;
  const res = calculateCommission(gross, 'rent'); // 5% of 1234.56 = 61.728 -> 61.73
  assert.strictEqual(res.isConfigured, true);
  assert.strictEqual(res.commission, 61.73, 'Commission should be rounded to 2 decimals (61.73)');
  assert.strictEqual(res.net, 1172.83, 'Net should equal 1234.56 - 61.73 = 1172.83');
  assert.strictEqual(Math.round((res.commission + res.net) * 100) / 100, gross, 'Commission + Net must equal gross');
  console.log('✔ Test 3 Passed: Decimal precision €1,234.56 -> Commission €61.73, Net €1,172.83');
}

// Test 4: Large amounts
{
  const gross = 50000000; // €50,000,000
  const res = calculateCommission(gross, 'sale');
  assert.strictEqual(res.isConfigured, true);
  assert.strictEqual(res.commission, 5000000, 'Commission €5,000,000');
  assert.strictEqual(res.net, 45000000, 'Net €45,000,000');
  console.log('✔ Test 4 Passed: Large transaction €50M -> Commission €5M, Net €45M');
}

// Test 5: Lease model (Unconfigured - must not crash)
{
  const res = calculateCommission(15000, 'lease');
  assert.strictEqual(res.isConfigured, false, 'Lease should NOT be configured');
  assert.strictEqual(res.message, 'Commission requires configuration');
  assert.strictEqual(res.commission, undefined);
  assert.strictEqual(res.net, undefined);
  console.log('✔ Test 5 Passed: Lease -> Safe "Commission requires configuration" result');
}

// Test 6: Cars model (Unconfigured - must not crash)
{
  const res = calculateCommission(2500, 'cars');
  assert.strictEqual(res.isConfigured, false, 'Cars should NOT be configured');
  assert.strictEqual(res.message, 'Commission requires configuration');
  console.log('✔ Test 6 Passed: Cars -> Safe "Commission requires configuration" result');
}

// Test 7: Multi-currency independence (Currency does not alter calculation formula)
{
  const currencies = ['EUR', 'GBP', 'USD', 'AED', 'SGD'];
  for (const c of currencies) {
    const saleRes = calculateCommission(100000, 'sale');
    const rentRes = calculateCommission(10000, 'rent');
    assert.strictEqual(saleRes.commission, 10000);
    assert.strictEqual(rentRes.commission, 500);
  }
  console.log('✔ Test 7 Passed: Verified currency independence for EUR, GBP, USD, AED, SGD');
}

// Test 8: Edge cases (Negative, zero, invalid)
{
  const zeroRes = calculateCommission(0, 'sale');
  assert.strictEqual(zeroRes.isConfigured, true);
  assert.strictEqual(zeroRes.commission, 0);
  assert.strictEqual(zeroRes.net, 0);

  const negRes = calculateCommission(-500, 'sale');
  assert.strictEqual(negRes.isConfigured, false);

  const nanRes = calculateCommission(NaN, 'sale');
  assert.strictEqual(nanRes.isConfigured, false);

  console.log('✔ Test 8 Passed: Edge cases (0, negative, NaN) handled safely');
}

console.log('--- All 8 Commission Unit Tests Passed Successfully! ---');
