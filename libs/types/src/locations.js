const configured = (
  process.env.LOCATIONS || process.env.REACT_APP_LOCATIONS
)?.split(",")

const data = {
  "0d9625c8-f9bd-4b0c-9de5-960fff50b30c": {
    label: "PrEPpoint ARAS București",
    city: "București",
    address: "Str. Ocolului nr. 20",
    phone: "+40751010539",
    email: "preppoint@arasnet.ro",
    // businessHours: [day, (start)hours:minutes, (end)hours:minutes] UTC
    businessHours: [[3, "14:00", "18:00"]],
    services: ["prep"],
  },
  "e3a607c9-7bce-459e-9ae2-25d30d8db95c": {
    label: "Checkpoint ARAS București",
    city: "București",
    address: "Bd. Eroii Sanitari nr. 49",
    phone: "+40751010539",
    businessHours: [
      [2, "14:00", "18:00"],
      [4, "14:00", "18:00"],
    ],
    services: ["testing"],
  },
  "8eb5ded5-7694-4783-ad37-bbdb26e0f659": {
    label: "Checkpoint ARAS Cluj",
    city: "Cluj-Napoca",
    address: "Piața Unirii nr. 22",
    phone: "+40751111017",
    businessHours: [
      [2, "14:00", "18:00"],
      [4, "14:00", "18:00"],
    ],
    services: ["testing"],
  },
  "6bec1930-2983-40fb-a4f1-0bed8f4e609e": {
    label: "Checkpoint ARAS Iași",
    city: "Iași",
    address: "Str. Păcurari nr. 66",
    phone: "+40751120708",
    businessHours: [[4, "14:00", "18:00"]],
    services: ["testing"],
  },
  "c7947f5c-6323-4ef5-81ab-60b1c9e69cf5": {
    label: "Checkpoint ARAS Timișoara",
    city: "Timișoara",
    address: "Str. Coriolan Brediceanu nr. 13B",
    phone: "+40751120840",
    businessHours: [[4, "14:00", "18:00"]],
    services: ["testing"],
  },
}

const locations = configured
  ? configured.reduce(
      (acc, id) =>
        data[id]
          ? {
              ...acc,
              [id]: data[id],
            }
          : acc,
      {}
    )
  : data

export default locations
