import { faker } from "@faker-js/faker"
import fs from "fs"

const data = {
  employees: [
    {
      id: 0,
      first: "Admin",
      last: "Dalvit",
      phone: "077-777-7777",
      email: "admin@arasnet.ro",
      password: "admin",
      permissions: {
        // 0 - no access, 1 - read, 2 - read&write, 3 - read&write&delete
        Bucuresti: {
          consultations: 3,
          employees: 3,
        },
        Cluj: {
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
    phone: faker.phone.number(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
    permissions: {
      Bucuresti: {
        consultations: [0, 1, 2, 3][Math.floor(Math.random() * 4)],
        employees: [0, 1, 2, 3][Math.floor(Math.random() * 4)],
      },
      Cluj: {
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
    phone: faker.phone.number(),
    date:
      index < 10
        ? "1970-01-01T00:00:00.000Z"
        : index < 30
          ? faker.date.past()
          : index > 70
            ? faker.date.future()
            : faker.date.soon(),
    location: ["Bucuresti", "Cluj"][Math.floor(Math.random() * 2)],
    createdAt: new Date().toISOString(),
  }
}
//#endregion
