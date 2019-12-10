/*
** source: electron-ssr/blob/master/src/shared/env.js
*/
import os from 'os'
import { execSync } from 'child_process'

export const platform = os.platform()

export const isWin = platform === 'win32'
export const isMac = platform === 'darwin'
export const isLinux = platform === 'linux'

// python 是否已安装
export let isPythonInstalled: boolean
try {
  isPythonInstalled = /^hello$/.test(execSync(`python -c "print('hello')"`).toString().trim())
} catch (e) {}

/*
** https://stackoverflow.com/questions/34541575/how-to-get-existing-php-python-version-number-from-node-js-app
** TODO
*/
export let pythonVersion: string
try {
  pythonVersion = execSync(`python3 --version`).toString()
} catch (e) {
  try {
    pythonVersion = execSync(`python -c "import platform; print(platform.python_version())"`).toString()
  } catch (e) {}
}