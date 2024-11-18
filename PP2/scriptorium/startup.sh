#!/bin/bash

cd scriptorium
npm install
npx prisma migrate dev
npx prisma generate
node createAdmin.js