import { faker } from "@faker-js/faker"
import fs from "fs"

import { consultationLocations, consultationStatuses } from "@arasnet/types"

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
        "0d9625c8-f9bd-4b0c-9de5-960fff50b30c": {
          consultations: ["create", "read", "update", "delete"],
          employees: ["create", "read", "update", "delete"],
        },
        "e3a607c9-7bce-459e-9ae2-25d30d8db95c": {
          consultations: ["create", "read", "update", "delete"],
          employees: ["create", "read", "update", "delete"],
        },
        "8eb5ded5-7694-4783-ad37-bbdb26e0f659": {
          consultations: ["create", "read", "update", "delete"],
          employees: ["create", "read", "update", "delete"],
        },
        "6bec1930-2983-40fb-a4f1-0bed8f4e609e": {
          consultations: ["create", "read", "update", "delete"],
          employees: ["create", "read", "update", "delete"],
        },
        "c7947f5c-6323-4ef5-81ab-60b1c9e69cf5": {
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
        "0d9625c8-f9bd-4b0c-9de5-960fff50b30c": {
          consultations: ["create"],
        },
        "e3a607c9-7bce-459e-9ae2-25d30d8db95c": {
          consultations: ["create"],
        },
        "8eb5ded5-7694-4783-ad37-bbdb26e0f659": {
          consultations: ["create"],
        },
        "6bec1930-2983-40fb-a4f1-0bed8f4e609e": {
          consultations: ["create"],
        },
        "c7947f5c-6323-4ef5-81ab-60b1c9e69cf5": {
          consultations: ["create"],
        },
      },
      createdAt: new Date().toISOString(),
      createdBy: "SYSTEM",
    },
    {
      id: 2,
      first: "Admin",
      last: "Bucuresti",
      phone: "0777777777",
      email: "admin@bucuresti.ro",
      password: "pass",
      permissions: {
        "0d9625c8-f9bd-4b0c-9de5-960fff50b30c": {
          consultations: ["create", "read", "update", "delete"],
          employees: ["create", "read", "update", "delete"],
        },
        "e3a607c9-7bce-459e-9ae2-25d30d8db95c": {
          consultations: ["create", "read", "update", "delete"],
          employees: ["create", "read", "update", "delete"],
        },
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      first: "User",
      last: "Bucuresti",
      phone: "0777777777",
      email: "user@bucuresti.ro",
      password: "pass",
      permissions: {
        "0d9625c8-f9bd-4b0c-9de5-960fff50b30c": {
          consultations: ["read"],
          employees: ["read"],
        },
        "e3a607c9-7bce-459e-9ae2-25d30d8db95c": {
          consultations: ["read"],
          employees: ["read"],
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
      [Object.keys(consultationLocations)[
        Math.floor(Math.random() * Object.keys(consultationLocations).length)
      ]]: {
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
    location: Object.keys(consultationLocations)[
      Math.floor(Math.random() * Object.keys(consultationLocations).length)
    ],
    createdAt: new Date().toISOString(),
    status:
      Object.keys(consultationStatuses)[
        Math.floor(Math.random() * Object.keys(consultationStatuses).length)
      ],
  }
}
//#endregion
