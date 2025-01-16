import { test, expect } from '@playwright/test';

test('app renders successfully', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByLabel('Username')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});

