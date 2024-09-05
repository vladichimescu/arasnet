import { faker } from "@faker-js/faker"
import fs from "fs"

import { encrypt } from "@arasnet/functions"
import {
  apiActions,
  prepCategories,
  prepLocations,
  prepStatuses,
  testingLocations,
  testingStatuses,
} from "@arasnet/types"

const file = process.env.DB_FILE
const password = await encrypt("pass")

const data = {
  employees: [
    {
      id: 0,
      firstName: "Admin",
      lastName: "ARASnet",
      phone: "+40000000000",
      email: "admin@arasnet.ro",
      password,
      permissions: {
        employees: [["create"], ["read"], ["update"], ["remove"]],
        testing: [["create"], ["read"], ["update"], ["remove"]],
        prep: [["create"], ["read"], ["update"], ["remove"]],
      },
      createdAt: new Date().toISOString(),
      createdBy: "SYSTEM",
    },
    {
      id: 1,
      firstName: "Website",
      lastName: "ARASnet",
      phone: "+40000000000",
      email: "website@arasnet.ro",
      password,
      permissions: {
        testing: [["create"]],
      },
      createdAt: new Date().toISOString(),
      createdBy: "SYSTEM",
    },
    {
      id: 2,
      firstName: "Admin",
      lastName: "Bucuresti",
      phone: "+40777777777",
      email: "admin@bucuresti.ro",
      password,
      permissions: {
        employees: [["create"], ["read"], ["update"], ["remove"]],
        testing: [
          [
            "create",
            [
              "location",
              [
                "0d9625c8-f9bd-4b0c-9de5-960fff50b30c",
                "e3a607c9-7bce-459e-9ae2-25d30d8db95c",
              ],
            ],
          ],
          [
            "read",
            [
              "location",
              [
                "0d9625c8-f9bd-4b0c-9de5-960fff50b30c",
                "e3a607c9-7bce-459e-9ae2-25d30d8db95c",
              ],
            ],
          ],
          [
            "update",
            [
              "location",
              [
                "0d9625c8-f9bd-4b0c-9de5-960fff50b30c",
                "e3a607c9-7bce-459e-9ae2-25d30d8db95c",
              ],
            ],
          ],
          [
            "remove",
            [
              "location",
              [
                "0d9625c8-f9bd-4b0c-9de5-960fff50b30c",
                "e3a607c9-7bce-459e-9ae2-25d30d8db95c",
              ],
            ],
          ],
        ],
        prep: [
          ["create", ["location", ["0d9625c8-f9bd-4b0c-9de5-960fff50b30c"]]],
          ["read", ["location", ["0d9625c8-f9bd-4b0c-9de5-960fff50b30c"]]],
          ["update", ["location", ["0d9625c8-f9bd-4b0c-9de5-960fff50b30c"]]],
          ["remove", ["location", ["0d9625c8-f9bd-4b0c-9de5-960fff50b30c"]]],
        ],
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      firstName: "User",
      lastName: "Bucuresti",
      phone: "+40777777777",
      email: "user@bucuresti.ro",
      password,
      permissions: {
        employees: [["read"]],
        testing: [
          ["read", ["location", ["0d9625c8-f9bd-4b0c-9de5-960fff50b30c"]]],
        ],
      },
      createdAt: new Date().toISOString(),
    },
    ...[...Array(47)].map(mockEmployee),
  ],
  testing: [...Array(135)].map(mockTesting),
  prep: [...Array(135)].map(mockPrep),
}

fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8")

//#region
function mockEmployee(_, index) {
  return {
    id: index + 4,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: faker.helpers.fromRegExp("+4[0-9]{10}"),
    email: faker.internet.email().toLowerCase(),
    password,
    permissions: {
      employees: apiActions
        .slice(0, Math.floor(Math.random() * 4))
        .map((action) => [action]),
      testing: apiActions
        .slice(0, Math.floor(Math.random() * 4))
        .map((action) => [
          action,
          [
            "location",
            [
              Object.keys(testingLocations)[
                Math.floor(Math.random() * Object.keys(testingLocations).length)
              ],
            ],
          ],
        ]),
    },
    createdAt: new Date().toISOString(),
  }
}

function mockTesting(_, index) {
  return {
    id: index + 1,
    phone: faker.helpers.fromRegExp("+4[0-9]{10}"),
    date:
      index < 10
        ? "1970-01-01T00:00:00.000Z"
        : index < 30
          ? faker.date.past()
          : index > 70
            ? faker.date.future()
            : faker.date.soon(),
    location:
      Object.keys(testingLocations)[
        Math.floor(Math.random() * Object.keys(testingLocations).length)
      ],
    name: faker.person.firstName(),
    createdAt: new Date().toISOString(),
    status:
      Object.keys(testingStatuses)[
        Math.floor(Math.random() * Object.keys(testingStatuses).length)
      ],
    firstTime: faker.datatype.boolean(),
  }
}

function mockPrep(_, index) {
  return {
    id: index + 1,
    phone: faker.helpers.fromRegExp("+4[0-9]{10}"),
    date:
      index < 10
        ? "1970-01-01T00:00:00.000Z"
        : index < 30
          ? faker.date.past()
          : index > 70
            ? faker.date.future()
            : faker.date.soon(),
    location:
      Object.keys(prepLocations)[
        Math.floor(Math.random() * Object.keys(prepLocations).length)
      ],
    category:
      Object.keys(prepCategories)[
        Math.floor(Math.random() * Object.keys(prepCategories).length)
      ],
    name: faker.person.fullName(),
    createdAt: new Date().toISOString(),
    status:
      Object.keys(prepStatuses)[
        Math.floor(Math.random() * Object.keys(prepStatuses).length)
      ],
  }
}
//#endregion
