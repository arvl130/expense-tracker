# Expense Tracker

I want to be able to access, record, and update my expense catalog even when I'm
not in front of my computer. This is an I'm building to help me accomplish that.

## Setup

This project uses Amazon S3 for file storage, Google OAuth for authentication, and
MySQL/MariaDB for the database.

Create an IAM user for this project in your AWS account with the following permissions:

```
GetObject
PutObject
DeleteObject
```

Acquire OAuth 2.0 keys in your Google account with the following as 'Authorized redirect
URIs':

```
https://{YOUR_DOMAIN}/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

Clone this repository:

```sh
$ git clone https://github.com/arvl130/expense-tracker.git
$ cd expense-tracker
```

Pull down the project dependencies:

```sh
$ yarn install # or npm install
```

Copy the `.env.template` and fill in the required keys.

```sh
$ cp .env.template .env
$ vi .env # :wq to close
```

Apply the database schema:

```sh
$ yarn run prisma db push # or npx prisma db push
```

Run the development server:

```sh
$ yarn run dev # or npm run dev
```

To build for production, run the following:

```sh
$ yarn run build # or npm run build
```

## License

```
Copyright 2023 Angelo Geulin

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
```
