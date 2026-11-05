#!/usr/bin/env node

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../..');

const SUITES = [
  { name: 'Tier 1: Feature Coverage (F1–F5)', file: 'tier1-features.test.mjs', expectedCount: 25 },
  { name: 'Tier 2: Boundary & Corner Cases (B1–B4)', file: 'tier2-boundaries.test.mjs', expectedCount: 20 },
  { name: 'Tier 3: Cross-Feature Combinations (X1–X5)', file: 'tier3-cross-feature.test.mjs', expectedCount: 5 },
  { name: 'Tier 4: Real-World Scenarios (A–E)', file: 'tier4-scenarios.test.mjs', expectedCount: 5 },
];

function runSuite(suite) {
  return new Promise((resolve) => {
    const testPath = path.join(__dirname, suite.file);
    const start = Date.now();
    const proc = spawn('node', ['--test', testPath], {
      cwd: PROJECT_ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env,
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (d) => {
      const str = d.toString();
      stdout += str;
      process.stdout.write(str);
    });

    proc.stderr.on('data', (d) => {
      const str = d.toString();
      stderr += str;
      process.stderr.write(str);
    });

    proc.on('close', (code) => {
      const durationMs = Date.now() - start;
      const passMatch = stdout.match(/ℹ pass (\d+)/);
      const failMatch = stdout.match(/ℹ fail (\d+)/);
      const passCount = passMatch ? parseInt(passMatch[1], 10) : 0;
      const failCount = failMatch ? parseInt(failMatch[1], 10) : 0;

      resolve({
        name: suite.name,
        file: suite.file,
        code,
        durationMs,
        passCount,
        failCount,
        stdout,
        stderr,
      });
    });
  });
}

async function main() {
  console.log('\n============================================================');
  console.log('   angrove.ru OPAQUE-BOX E2E TEST SUITE RUNNER (TIERS 1–4)  ');
  console.log('============================================================\n');

  const startTime = Date.now();
  const results = [];

  for (const suite of SUITES) {
    console.log(`\n>>> Launching ${suite.name}...`);
    const res = await runSuite(suite);
    results.push(res);
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
  const totalPassed = results.reduce((sum, r) => sum + r.passCount, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.failCount, 0);
  const totalTests = totalPassed + totalFailed;
  const anyFailed = results.some((r) => r.code !== 0 || r.failCount > 0);

  console.log('\n============================================================');
  console.log('                   E2E TEST RUN SUMMARY                     ');
  console.log('============================================================');
  console.table(
    results.map((r) => ({
      Suite: r.name,
      Status: r.code === 0 && r.failCount === 0 ? 'PASS' : 'FAIL',
      Passed: r.passCount,
      Failed: r.failCount,
      'Time (s)': (r.durationMs / 1000).toFixed(2),
    }))
  );

  console.log(`Total tests run: ${totalTests}`);
  console.log(`Total passed:    ${totalPassed}`);
  console.log(`Total failed:    ${totalFailed}`);
  console.log(`Total elapsed:   ${totalTime}s\n`);

  if (anyFailed) {
    console.error('❌ E2E TEST SUITE FAILED with errors.');
    process.exit(1);
  } else {
    console.log('✅ ALL E2E TEST TIERS PASSED SUCCESSFULLY (100% Pass Rate).');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Master runner fatal error:', err);
  process.exit(1);
});
