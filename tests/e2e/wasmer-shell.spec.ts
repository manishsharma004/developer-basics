import { expect, test, type Browser, type Page } from '@playwright/test'

const SHELL_LESSON = '/#/lessons/docker-containers'
const WAIT_MS = 19_000

async function terminalText(page: Page): Promise<string> {
  const terminal = page.locator('.wasmer-terminal')
  await expect(terminal).toBeVisible({ timeout: WAIT_MS })
  const rows = terminal.locator('.xterm-rows')
  const chunks: string[] = []
  const count = await rows.count()
  for (let i = 0; i < count; i++) {
    chunks.push(await rows.nth(i).innerText())
  }
  return chunks.join('\n').replace(/\s+/g, ' ').trim()
}

async function waitForShellReady(page: Page): Promise<void> {
  await page.goto(SHELL_LESSON)
  await page.locator('.wasmer-terminal').scrollIntoViewIfNeeded()

  await expect(page.locator('.runtime-banner')).toBeHidden({ timeout: WAIT_MS })

  await expect
    .poll(async () => terminalText(page), { timeout: WAIT_MS })
    .toMatch(/bash-dist#|lab\$/)

  await expect(page.locator('.wasmer-terminal[data-shell-bootstrapped="true"]')).toBeVisible({
    timeout: WAIT_MS,
  })
}

async function runShellCommand(
  page: Page,
  command: string,
  expectInOutput: RegExp | string,
): Promise<string> {
  const terminal = page.locator('.wasmer-terminal')
  await terminal.scrollIntoViewIfNeeded()

  const input = terminal.locator('textarea.xterm-helper-textarea').first()
  await input.focus()

  const before = await terminalText(page)

  await input.pressSequentially(command, { delay: 15 })
  await input.press('Enter')

  const matcher =
    typeof expectInOutput === 'string'
      ? new RegExp(expectInOutput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      : expectInOutput

  await expect
    .poll(async () => {
      const text = await terminalText(page)
      if (text === before || !text.includes(command)) return ''
      const tail = text.slice(text.lastIndexOf(command) + command.length)
      return matcher.test(tail) ? text : ''
    }, { timeout: WAIT_MS })
    .not.toBe('')

  return terminalText(page)
}

test('cross-origin isolation is enabled', async ({ page }) => {
  await page.goto(SHELL_LESSON)
  const isolated = await page.evaluate(() => window.crossOriginIsolated)
  expect(isolated).toBe(true)
})

test.describe.serial('Wasmer container shell commands', () => {
  let shellPage: Page

  test.beforeAll(async ({ browser }: { browser: Browser }) => {
    shellPage = await browser.newPage()
    await waitForShellReady(shellPage)
  })

  test.afterAll(async () => {
    await shellPage?.close()
  })

  test('bash prompt returns after echo', async () => {
    const text = await runShellCommand(shellPage, 'echo ok', /ok/)
    expect(text).toMatch(/bash-dist#|lab\$/)
  })

  test('docker run without build shows helpful error', async () => {
    const text = await runShellCommand(
      shellPage,
      'docker run myapp:1.0',
      /Unable to find image|build it first/i,
    )
    expect(text).toMatch(/Unable to find image|build it first/i)
  })

  test('lab filesystem is mounted in ~/lab', async () => {
    const text = await runShellCommand(shellPage, 'pwd', /\/home\/lab/)
    expect(text).toMatch(/\/home\/lab/)
  })

  test('touch and ls work in /var/lab', async () => {
    await runShellCommand(shellPage, 'cd /var/lab', /bash-dist#|lab\$/)
    await runShellCommand(shellPage, 'touch a-file.txt', /bash-dist#|lab\$/)
    const text = await runShellCommand(shellPage, 'ls -1 a-file.txt', /a-file\.txt/)
    expect(text).toMatch(/a-file\.txt/)
  })

  test('docker build honors custom image tags', async () => {
    await runShellCommand(
      shellPage,
      'docker build -t sample-img .',
      /Successfully built and tagged sample-img/,
    )
    const text = await runShellCommand(shellPage, 'docker image ls', /sample-img/)
    expect(text).toMatch(/sample-img/)
  })

  test('docker build run and ps workflow', async () => {
    await runShellCommand(shellPage, 'docker build -t myapp:1.0 .', /Successfully built and tagged myapp:1\.0/)
    await runShellCommand(shellPage, 'docker image ls', /myapp.*1\.0|REPOSITORY/)
    await runShellCommand(shellPage, 'docker run -d myapp:1.0', /c\d+/)
    const text = await runShellCommand(shellPage, 'docker ps', /myapp:1\.0|running/)
    expect(text).toMatch(/running|myapp:1\.0/)
    expect(text).not.toMatch(/\(no containers\)/)
  })

  test('docker container ls matches docker ps after run', async () => {
    const text = await runShellCommand(shellPage, 'docker container ls', /myapp:1\.0|running/)
    expect(text).toMatch(/running|myapp:1\.0/)
  })

  test('docker images and logs show staged build context', async () => {
    const imagesText = await runShellCommand(shellPage, 'docker images', /myapp.*1\.0/)
    expect(imagesText).toMatch(/myapp.*1\.0/)
    const logsText = await runShellCommand(
      shellPage,
      'docker logs c1',
      /package\.json from image layer|listening on/,
    )
    expect(logsText).toMatch(/package\.json from image layer|listening on/)
    const execText = await runShellCommand(shellPage, 'docker exec c1 ls', /package\.json/)
    expect(execText).toMatch(/package\.json/)
  })
})
