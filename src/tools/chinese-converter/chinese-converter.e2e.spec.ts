import { test, expect } from '@playwright/test';

test.describe('Tool - Chinese converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chinese-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Chinese converter - IT Tools');
  });

  test('', async ({ page }) => {

  });
});