import weekOneMeridian from "../examples/meridian-week-1-input.json" with { type: "json" };

// Shared fictional teaching fixtures. These are not live observations.
export const examples = [
  {
    id: "product",
    packet: {
      label: "Fictional Meridian training example",
      requirements: [
        {
          id: "R1",
          text: "A valid driver can continue to Vehicle details.",
          risk: "high",
        },
        {
          id: "R2",
          text: "An empty driver email prevents continuing and displays Email is required.",
          risk: "high",
        },
        {
          id: "R3",
          text: "An unbound saved quote can be retrieved using its quote reference.",
          risk: "medium",
        },
      ],
      failures: [
        {
          id: "E1",
          text: "In a training browser observation, Email was empty. Continue opened Vehicle details without displaying Email is required. The expected guard did not prevent navigation.",
        },
      ],
      observedSteps: [
        {
          id: "S1",
          action: "Open the driver-details form in the training application.",
        },
        {
          id: "S2",
          action:
            "Leave Email empty, fill the other required fields with fictional valid data, and select Continue.",
        },
      ],
      tests: [
        {
          id: "T1",
          title: "Valid driver can continue",
          assertions: [
            {
              requirementId: "R1",
              text: "Vehicle details heading is visible after Continue with valid input.",
            },
          ],
          runStatus: "not_run",
        },
        {
          id: "T2",
          title: "Driver input is retained",
          assertions: [],
          runStatus: "not_run",
        },
      ],
    },
  },
  {
    id: "test",
    packet: {
      label: "Fictional test defect",
      requirements: [
        {
          id: "R1",
          text: "A valid driver can continue to Vehicle details.",
          risk: "high",
        },
        {
          id: "R2",
          text: "An empty driver email prevents continuing and displays Email is required.",
          risk: "high",
        },
        {
          id: "R3",
          text: "An unbound saved quote can be retrieved using its quote reference.",
          risk: "medium",
        },
      ],
      failures: [
        {
          id: "E1",
          text: "The test expected Vehicle details before selecting Continue. The trace shows Driver details still open; a manual repeat selecting Continue reaches Vehicle details. The assertion was placed before the required action.",
        },
      ],
      observedSteps: [],
      tests: [
        {
          id: "T1",
          title: "Valid driver can continue",
          assertions: [
            {
              requirementId: "R1",
              text: "Vehicle details heading is visible after Continue with valid input.",
            },
          ],
          runStatus: "not_run",
        },
        {
          id: "T2",
          title: "Driver input is retained",
          assertions: [],
          runStatus: "not_run",
        },
      ],
    },
  },
  {
    id: "environment",
    packet: {
      label: "Fictional environment failure",
      requirements: [
        {
          id: "R1",
          text: "A valid driver can continue to Vehicle details.",
          risk: "high",
        },
        {
          id: "R2",
          text: "An empty driver email prevents continuing and displays Email is required.",
          risk: "high",
        },
        {
          id: "R3",
          text: "An unbound saved quote can be retrieved using its quote reference.",
          risk: "medium",
        },
      ],
      failures: [
        {
          id: "E1",
          text: "The training server health check and all pages returned HTTP 503 during the run. No driver form rendered and no business assertions executed.",
        },
      ],
      observedSteps: [],
      tests: [
        {
          id: "T1",
          title: "Valid driver can continue",
          assertions: [
            {
              requirementId: "R1",
              text: "Vehicle details heading is visible after Continue with valid input.",
            },
          ],
          runStatus: "not_run",
        },
        {
          id: "T2",
          title: "Driver input is retained",
          assertions: [],
          runStatus: "not_run",
        },
      ],
    },
  },
  {
    id: "flake",
    packet: {
      label: "Fictional intermittent failure",
      requirements: [
        {
          id: "R1",
          text: "A valid driver can continue to Vehicle details.",
          risk: "high",
        },
        {
          id: "R2",
          text: "An empty driver email prevents continuing and displays Email is required.",
          risk: "high",
        },
        {
          id: "R3",
          text: "An unbound saved quote can be retrieved using its quote reference.",
          risk: "medium",
        },
      ],
      failures: [
        {
          id: "E1",
          text: "Identical input and revision failed once while waiting for the heading and passed once on a controlled repeat. Timing evidence is incomplete; the mechanism and absence of a product defect have not been established.",
        },
      ],
      observedSteps: [],
      tests: [
        {
          id: "T1",
          title: "Valid driver can continue",
          assertions: [
            {
              requirementId: "R1",
              text: "Vehicle details heading is visible after Continue with valid input.",
            },
          ],
          runStatus: "not_run",
        },
        {
          id: "T2",
          title: "Driver input is retained",
          assertions: [],
          runStatus: "not_run",
        },
      ],
    },
  },
  {
    id: "insufficient",
    packet: {
      label: "Fictional incomplete evidence",
      requirements: [
        {
          id: "R1",
          text: "A valid driver can continue to Vehicle details.",
          risk: "high",
        },
        {
          id: "R2",
          text: "An empty driver email prevents continuing and displays Email is required.",
          risk: "high",
        },
        {
          id: "R3",
          text: "An unbound saved quote can be retrieved using its quote reference.",
          risk: "medium",
        },
      ],
      failures: [
        {
          id: "E1",
          text: "A timeout occurred. No failing action, trace, response, recent change, or controlled repeat was supplied.",
        },
      ],
      observedSteps: [],
      tests: [
        {
          id: "T1",
          title: "Valid driver can continue",
          assertions: [
            {
              requirementId: "R1",
              text: "Vehicle details heading is visible after Continue with valid input.",
            },
          ],
          runStatus: "not_run",
        },
        {
          id: "T2",
          title: "Driver input is retained",
          assertions: [],
          runStatus: "not_run",
        },
      ],
    },
  },
  { id: "week-one-meridian", packet: weekOneMeridian, agent: "test-cases" },
];
