const { test, expect } = require('@playwright/test');

test.describe('Authentication Flows', () => {
  test('should load the admin login page', async ({ page }) => {
    await page.goto('/admin-login');
    await expect(page.locator('h2', { hasText: 'BM-OS Administration' })).toBeVisible();
    await expect(page.getByPlaceholder('Admin ID or Email')).toBeVisible();
  });

  test('should load the student/client login page', async ({ page }) => {
    await page.goto('/student-login');
    await expect(page.locator('h1', { hasText: 'Welcome Back' })).toBeVisible();
    await expect(page.getByPlaceholder('Email address')).toBeVisible();
  });
});
