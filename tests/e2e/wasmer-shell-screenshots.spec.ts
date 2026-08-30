import { expect, test } from '@playwright/test'
import path from 'node:path'

const SHELL_LESSON = '/#/lessons/docker-containers'
const WAIT_MS = 19_000
const ARTIFACTS_DIR = '/workspace/.cursor/artifacts/screenshots'

async function terminalText(page: import('@playwright/test').Page): Promise<string> {
  const rows = page.locator('.wasmer-terminal .xterm-rows')
  const chunks: string[] = []
  for (let i = 0; i < (await rows.count()); i++) {
    chunks.push(await rows.nth(i).innerText())
  }
  return chunks.join('\n').replace(/\s+/g, ' ').trim()
}

test('capture wasmer shell walkthrough screenshots', async ({ page }) => {
  await page.goto(SHELL_LESSON)
  await page.locator('.wasmer-terminal').scrollIntoViewIfNeeded()

  await expect(page.locator('.runtime-banner')).toBeHidden({ timeout: WAIT_MS })
  await expect.poll(async () => terminalText(page), { timeout: WAIT_MS }).toMatch(/bash-dist#|lab\$/)
  await expect(page.locator('.wasmer-terminal[data-shell-bootstrapped="true"]')).toBeVisible({
    timeout: WAIT_MS,
  })

  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'shell_bash_dist_prompt.png'),
    fullPage: false,
  })

  await expect(page.locator('.container-shell-welcome')).toContainText('Containerization lab ready')

  const input = page.locator('.wasmer-terminal textarea.xterm-helper-textarea').first()
  await input.focus()
  await input.pressSequentially('echo hello', { delay: 15 })
  await input.press('Enter')
  await expect.poll(async () => terminalText(page), { timeout: WAIT_MS }).toMatch(/hello/)

  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'shell_echo_hello.png'),
    fullPage: false,
  })

  await input.pressSequentially('docker ps', { delay: 15 })
  await input.press('Enter')
  await expect.poll(async () => terminalText(page), { timeout: WAIT_MS }).toMatch(/no containers|ID/)

  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'shell_docker_ps.png'),
    fullPage: false,
  })

  await input.pressSequentially('docker build -t myapp:1.0 .', { delay: 15 })
  await input.press('Enter')
  await expect.poll(async () => terminalText(page), { timeout: WAIT_MS }).toMatch(/Successfully tagged/)

  await input.pressSequentially('docker ps', { delay: 15 })
  await input.press('Enter')
  await expect.poll(async () => terminalText(page), { timeout: WAIT_MS }).toMatch(/myapp|no containers|ID/)
})
