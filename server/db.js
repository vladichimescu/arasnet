import { faker } from "@faker-js/faker"
import fs from "fs"

import { encrypt } from "@arasnet/functions"
import {
  apiActions,
  consultationLocations,
  consultationStatuses,
} from "@arasnet/types"

const file = process.env.ARASNET_DB_FILE
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
        consultations: [["create"], ["read"], ["update"], ["remove"]],
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
        consultations: [["create"]],
      },
      createdAt: new Date().toISOString(),
      createdBy: "SYSTEM",
    },
    {
      id: 2,
      firstName: "Admin",
      lastName: "Bucuresti",
      phone: "0777777777",
      email: "admin@bucuresti.ro",
      password,
      permissions: {
        employees: [["create"], ["read"], ["update"], ["remove"]],
        consultations: [
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
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      firstName: "User",
      lastName: "Bucuresti",
      phone: "0777777777",
      email: "user@bucuresti.ro",
      password,
      permissions: {
        employees: [["read"]],
        consultations: [
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
        ],
      },
      createdAt: new Date().toISOString(),
    },
    ...[...Array(47)].map(mockEmployee),
  ],
  consultations: [...Array(135)].map(mockConsultation),
}

fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8")

//#region
function mockEmployee(_, index) {
  return {
    id: index + 4,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: faker.helpers.fromRegExp("[0-9]{10}"),
    email: faker.internet.email().toLowerCase(),
    password,
    permissions: {
      employees: apiActions
        .slice(0, Math.floor(Math.random() * 4))
        .map((action) => [action]),
      consultations: apiActions
        .slice(0, Math.floor(Math.random() * 4))
        .map((action) => [
          action,
          [
            "location",
            [
              Object.keys(consultationLocations)[
                Math.floor(
                  Math.random() * Object.keys(consultationLocations).length
                )
              ],
            ],
          ],
        ]),
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
