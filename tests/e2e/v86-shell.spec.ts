import { expect, test } from '@playwright/test'

const SHELL_LESSON = '/#/lessons/docker-containers'

test.describe('shell runtime', () => {
  test('v86 podman plan assets are documented', async ({ page }) => {
    await page.goto(SHELL_LESSON)
    const text = await page.locator('.container-shell').innerText()
    expect(text).toMatch(/podman build/i)
    expect(text).toMatch(/v86:build-image/i)
    expect(text).toMatch(/Shell mode/i)
  })

  test('shell backend toggle works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(SHELL_LESSON)
    const toggle = page.locator('.shell-backend-toggle')
    await expect(toggle).toBeVisible()
    const wasmerBtn = toggle.getByRole('button', { name: /Wasmer shell/i })
    const v86Btn = toggle.getByRole('button', { name: /v86 Podman VM/i })
    await expect(wasmerBtn).toBeVisible()
    await expect(v86Btn).toBeVisible()
    await wasmerBtn.click()
    await expect(wasmerBtn).toHaveAttribute('aria-pressed', 'true')
    if (await v86Btn.isEnabled()) {
      await v86Btn.click()
      await expect(v86Btn).toHaveAttribute('aria-pressed', 'true')
    }
  })
})

test.describe('v86 shell (optional)', () => {
  test.skip(!process.env.V86_E2E, 'Set V86_E2E=1 after bun run v86:build-image')

  test('podman build in v86 VM', async ({ page }) => {
    test.setTimeout(180_000)
    await page.goto(SHELL_LESSON)
    await expect(page.locator('.wasmer-terminal[data-shell-backend="v86"]')).toBeVisible({
      timeout: 120_000,
    })
  })
})
