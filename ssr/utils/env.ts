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
export let isPythonInstalled: boolean = false
try {
  isPythonInstalled = /^hello$/.test(execSync(`python -c "print('hello')"`).toString().trim())
} catch (e) {}

/*
** https://stackoverflow.com/questions/34541575/how-to-get-existing-php-python-version-number-from-node-js-app
** TODO
*/
export let pythonCLI: string
export let pythonVersion: string | null
try {
  pythonCLI = `python3`
  pythonVersion = execSync(`${ pythonCLI } --version`).toString()
  // [fix] exmple: Python 3.6.7\n
  let splitSoft: string[] | string = pythonVersion.split('Python')
  if (splitSoft.length >= 2) {
    splitSoft = splitSoft[1]
    splitSoft = splitSoft.split('\n')[0]
  } else splitSoft = splitSoft[0]
  pythonVersion = splitSoft
} catch (e) {
  // TODO python2(2020已经不再支持了:3, 现在是2019-12-16)
  try {
    pythonCLI = `python`
    pythonVersion = execSync(`${ pythonCLI } -c "import platform; print(platform.python_version())"`).toString()
    // [fix] exmple: 2.7.16\n
    pythonVersion = pythonVersion.split('\n')[0]
  } catch (e) {
    pythonVersion = null
  }
}