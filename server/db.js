import { faker } from "@faker-js/faker"
import fs from "fs"

// TODO: rename supportedLocations to consultationLocations
const supportedLocations = process.env.SUPPORTED_LOCATIONS.split(",")
const consultationStatuses = process.env.CONSULTATION_STATUSES.split(",")

//TODO: dev should use .env.local and inject in memory data
//TODO: production should use .env.production and use db.json (encrypt)
const data = {
  employees: [
    {
      id: 0,
      first: "Admin",
      last: "Dalvit",
      phone: "0777777777",
      email: "admin@arasnet.ro",
      password: "pass",
      permissions: {
        consultations: {
          access: ["create", "read", "update", "delete"],
        },
        employees: {
          access: ["create", "read", "update", "delete"],
        },
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: 1,
      first: "Bucuresti",
      last: "Dalvit",
      phone: "0777777777",
      email: "admin@bucuresti.ro",
      password: "pass",
      permissions: {
        consultations: {
          access: ["create", "read", "update", "delete"],
          filters: {
            location: ["bucuresti"],
          },
        },
        employees: {
          access: ["create", "read", "update", "delete"],
        },
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      first: "Bucuresti",
      last: "Dalvit",
      phone: "0777777777",
      email: "user@bucuresti.ro",
      password: "pass",
      permissions: {
        consultations: {
          access: ["read"],
          filters: {
            location: ["bucuresti"],
          },
        },
        employees: {
          access: ["read"],
        },
      },
      createdAt: new Date().toISOString(),
    },
    ...[...Array(10)].map(mockEmployee),
  ],
  consultations: [...Array(100)].map(mockConsultation),
}

fs.writeFileSync(process.env.DB_FILE, JSON.stringify(data, null, 2), "utf-8")

//#region
function mockEmployee(_, index) {
  return {
    id: index + 3,
    first: faker.person.firstName(),
    last: faker.person.lastName(),
    phone: faker.helpers.fromRegExp("[0-9]{10}"),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
    permissions: {
      consultations: {
        access: ["read"],
        filters: {
          location: [supportedLocations[Math.floor(Math.random() * 2)]],
        },
      },
    },
    createdAt: new Date().toISOString(),
  }
}

function mockConsultation(_, index) {
  return {
    id: index + 1,
    phone: faker.helpers.fromRegExp("[0-9]{10}"),
    date:
      index < 10
        ? "1970-01-01T00:00:00.000Z"
        : index < 30
          ? faker.date.past()
          : index > 70
            ? faker.date.future()
            : faker.date.soon(),
    location: supportedLocations[Math.floor(Math.random() * 2)],
    createdAt: new Date().toISOString(),
    status: consultationStatuses[Math.floor(Math.random() * 3)],
  }
}
//#endregion
