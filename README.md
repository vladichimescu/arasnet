# ARASnet

ARASnet is a platform designed to help manage ARAS activity.

# Setup

- Create a .env.production file with override values for the variables defined in .env
- having a certificate and a intermediate, concatenate by `cat certificate.pem intermediate.pem > cert.pem`
- Install node_modules: `yarn install`
- As dev, start the app: `yarn start`
- As production, build the app: `yarn build`, run it: `yarn serve` and stop it: `yarn stop`.
