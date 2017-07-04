# Cerebro plugin for pass

[![Build Status](https://travis-ci.org/maximbaz/cerebro-pass.svg?branch=master)](https://travis-ci.org/maximbaz/cerebro-pass) [![bitHound Overall Score](https://www.bithound.io/github/maximbaz/cerebro-pass/badges/score.svg)](https://www.bithound.io/github/maximbaz/cerebro-pass)

A [Cerebro](https://cerebroapp.com) plugin for [pass](https://www.passwordstore.org/). Supports [pass-otp](https://github.com/tadfisher/pass-otp) plugin.

### Available commands:

- Copy a password: `pass <query>`
- Copy a 2FA code: `otp <query>`
- Generate a password: `passgen <path>`

### Features:
- Narrow down the pass/otp search by writing multiple query words separated with a space: 
     - `pass face john` will filter all facebook accounts and show only John's credentials.

### Screenshot: 

![Screenshot](docs/screenshot.png)

Contributions are welcome, please submit a pull request or open an issue.
