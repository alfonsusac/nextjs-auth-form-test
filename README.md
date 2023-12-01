

# Next.js Simple Auth

**Authentication using Next.js App routing and server actions**

![GitHub Repo Badge](https://img.shields.io/badge/GitHub-Repository-brightgreen)

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). I created this project to learn more about web authentication practices such as implementing JWTs using cookies and such. Proper security practices are followed as much as possible (within the best of my knowledge), while its not perfect, please check again for security measures when using this repository as a reference.

Email API can be enabled when using the production environment. Otherwise, the verification key are logged to the server console in development.

![image](https://github.com/alfonsusac/nextjs-auth-form-test/assets/20208219/e33699ab-5480-4758-8332-bfa18de9c7ad)

![image](https://github.com/alfonsusac/nextjs-auth-form-test/assets/20208219/0a4c83a4-699b-493b-8a14-48171439fc92)


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Features & Concepts

### Password Hashing

Login via password, hashed with argon2id for enhanced security.

### Passwordless

Login without a password, verification via email using Resend.

### Email Verification

Verify email after logging in or when a critical action is needed.

### 2FA via Authenticator

Enables or disables 2FA via an authenticator such as Google Auth or Authy using otplib.

### Forgot Password

Send email verification when the password is forgotten to reset to a new password.

### JWT

Stores session state in the client, authenticating the user without accessing the database.

### WebAuthn

Log in via device authentication such as PIN or Biometrics. Powered by [passwordless.id](https://passwordless.id).

### No Client Components

Allowing progressive enhancement. Client components can still be used to increase interactivity.

### Form builder

Unify client and server-side validations. (This is just a proof of concept since it doesn't yet support all validations haha)

## Technologies

- [Next.js](https://nextjs.org/) - Full-stack JavaScript Framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Resend](https://resend.com/) - Email API
