import { faker } from "@faker-js/faker"
import fs from "fs"

const locations = process.env.LOCATIONS.split(",")
const consultationStatuses = process.env.CONSULTATION_STATUSES.split(",")

const data = {
  employees: [
    {
      id: 0,
      first: "Admin",
      last: "ARASnet",
      phone: "0777777777",
      email: "admin@arasnet.ro",
      password: "pass",
      permissions: {
        bucuresti: {
          consultations: ["create", "read", "update", "delete"],
          employees: ["create", "read", "update", "delete"],
        },
        cluj: {
          consultations: ["create", "read", "update", "delete"],
          employees: ["create", "read", "update", "delete"],
        },
      },
      createdAt: new Date().toISOString(),
      createdBy: "SYSTEM",
    },
    {
      id: 1,
      first: "Website",
      last: "ARASnet",
      phone: "0777777777",
      email: "website@arasnet.ro",
      password: "pass",
      permissions: {
        bucuresti: {
          consultations: ["create"],
          employees: [],
        },
        cluj: {
          consultations: ["create"],
          employees: [],
        },
      },
      createdAt: new Date().toISOString(),
      createdBy: "SYSTEM",
    },
    {
      id: 2,
      first: "Bucuresti",
      last: "Dalvit",
      phone: "0777777777",
      email: "admin@bucuresti.ro",
      password: "pass",
      permissions: {
        bucuresti: {
          consultations: ["create", "read", "update", "delete"],
          employees: ["create", "read", "update", "delete"],
        },
        cluj: {
          consultations: [],
          employees: [],
        },
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      first: "Bucuresti",
      last: "Dalvit",
      phone: "0777777777",
      email: "user@bucuresti.ro",
      password: "pass",
      permissions: {
        bucuresti: {
          consultations: ["read"],
          employees: ["read"],
        },
        cluj: {
          consultations: [],
          employees: [],
        },
      },
      createdAt: new Date().toISOString(),
    },
    ...[...Array(47)].map(mockEmployee),
  ],
  consultations: [...Array(500)].map(mockConsultation),
}

fs.writeFileSync(process.env.DB_FILE, JSON.stringify(data, null, 2), "utf-8")

//#region
function mockEmployee(_, index) {
  return {
    id: index + 4,
    first: faker.person.firstName(),
    last: faker.person.lastName(),
    phone: faker.helpers.fromRegExp("[0-9]{10}"),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
    permissions: {
      [locations[Math.floor(Math.random() * 2)]]: {
        consultations: ["create", "read", "update", "delete"].slice(
          0,
          Math.floor(Math.random() * 4)
        ),
        employees: ["create", "read", "update", "delete"].slice(
          0,
          Math.floor(Math.random() * 4)
        ),
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
    location: locations[Math.floor(Math.random() * 2)],
    createdAt: new Date().toISOString(),
    status: consultationStatuses[Math.floor(Math.random() * 3)],
  }
}
//#endregion
