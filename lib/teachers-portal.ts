// This is a mock implementation. In a real-world scenario, this would interact with your actual teachers portal API.
export async function getTeachersFromPortal() {
  // Simulating an API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return [
    {
      id: 1,
      name: "Emma Thompson",
      professionalDevelopment: { participations: 15, presentations: 3, totalPoints: 210 },
    },
    {
      id: 2,
      name: "Liam Johnson",
      professionalDevelopment: { participations: 12, presentations: 2, totalPoints: 170 },
    },
    {
      id: 3,
      name: "Olivia Martinez",
      professionalDevelopment: { participations: 18, presentations: 4, totalPoints: 260 },
    },
    {
      id: 4,
      name: "Noah Williams",
      professionalDevelopment: { participations: 10, presentations: 1, totalPoints: 130 },
    },
    { id: 5, name: "Ava Brown", professionalDevelopment: { participations: 14, presentations: 3, totalPoints: 200 } },
    { id: 6, name: "Ethan Davis", professionalDevelopment: { participations: 16, presentations: 2, totalPoints: 200 } },
    {
      id: 7,
      name: "Sophia Wilson",
      professionalDevelopment: { participations: 11, presentations: 1, totalPoints: 140 },
    },
    {
      id: 8,
      name: "Mason Anderson",
      professionalDevelopment: { participations: 13, presentations: 2, totalPoints: 170 },
    },
    {
      id: 9,
      name: "Isabella Taylor",
      professionalDevelopment: { participations: 17, presentations: 3, totalPoints: 230 },
    },
    {
      id: 10,
      name: "William Thomas",
      professionalDevelopment: { participations: 9, presentations: 1, totalPoints: 120 },
    },
  ]
}

