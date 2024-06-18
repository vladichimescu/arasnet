import { faker } from "@faker-js/faker"
import fs from "fs"

const data = {
  employees: [
    {
      id: 0,
      first: "Admin",
      last: "Dalvit",
      phone: "0777777777",
      email: "admin@arasnet.ro",
      password: "admin",
      permissions: {
        // 0 - no access, 1 - read, 2 - read&write, 3 - read&write&delete
        bucuresti: {
          consultations: 3,
          employees: 3,
        },
        cluj: {
          consultations: 3,
          employees: 3,
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
    id: index + 1,
    first: faker.person.firstName(),
    last: faker.person.lastName(),
    phone: faker.helpers.fromRegExp("[0-9]{10}"),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
    permissions: {
      bucuresti: {
        consultations: [0, 1, 2, 3][Math.floor(Math.random() * 4)],
        employees: [0, 1, 2, 3][Math.floor(Math.random() * 4)],
      },
      cluj: {
        consultations: [0, 1, 2, 3][Math.floor(Math.random() * 4)],
        employees: [0, 1, 2, 3][Math.floor(Math.random() * 4)],
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
    location: ["bucuresti", "cluj"][Math.floor(Math.random() * 2)],
    createdAt: new Date().toISOString(),
    status: ["PENDING", "CONFIRMED", "CANCELED"][Math.floor(Math.random() * 3)],
  }
}
//#endregion
