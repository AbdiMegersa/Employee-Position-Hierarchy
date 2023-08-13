export const data = [
  {
    label: "EthioCEO",
    data: { id: 1, parentId: null, title: "CEO", employee: ["John Doe"], description: "Responsible for overall company strategy and decision-making.", assignedEmployee: "John Doe" },
    expanded: true,
    styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
    type: "person",
    children: [
      {
        label: "EthioCTO",
        data: { id: 2, parentId: 1, title: "CTO", employee: ["Jane Smith"], description: "Oversees the company's technology and IT operations.", assignedEmployee: "Jane Smith" },
        expanded: true,
        styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
        type: "person",
        children: [
          {
            label: "EthioManager1",
            data: { id: 3, parentId: 2, title: "Manager 1", employee: ["Alex Johnson"], description: "Manages a team of developers and ensures project delivery.", assignedEmployee: "Alex Johnson" },
            expanded: true,
            styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
            type: "person",
            children: [
              {
                label: "EthioSupervisor1",
                data: { id: 4, parentId: 3, title: "Supervisor 1", employee: ["Emily Brown"], description: "Supervises a group of developers and coordinates their tasks.", assignedEmployee: "Emily Brown" },
                expanded: true,
                styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
                type: "person",
                children: [
                  {
                    label: "EthioTeamLead1",
                    data: { id: 5, parentId: 4, title: "Team Lead 1", employee: ["Michael Wilson"], description: "Leads a development team and oversees project execution.", assignedEmployee: "Michael Wilson" },
                    expanded: true,
                    styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
                    type: "person",
                    children: [
                      {
                        label: "EthioDeveloper1",
                        data: { id: 6, parentId: 5, title: "Developer 1", employee: [], description: "Responsible for coding and implementing software solutions.", assignedEmployee: "" },
                        expanded: true,
                        styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
                        type: "person",
                        children: []
                      },
                      {
                        label: "EthioQA1",
                        data: { id: 7, parentId: 5, title: "Quality Assurance 1", employee: [], description: "Ensures the quality and reliability of software through testing.", assignedEmployee: "" },
                        expanded: true,
                        styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
                        type: "person",
                        children: []
                      }
                    ]
                  },
                  {
                    label: "EthioTeamLead2",
                    data: { id: 8, parentId: 4, title: "Team Lead 2", employee: ["Sarah Davis"], description: "Leads another development team and oversees project execution.", assignedEmployee: "Sarah Davis" },
                    expanded: true,
                    styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
                    type: "person",
                    children: [
                      {
                        label: "EthioDeveloper2",
                        data: { id: 9, parentId: 8, title: "Developer 2", employee: [], description: "Responsible for coding and implementing software solutions.", assignedEmployee: "" },
                        expanded: true,
                        styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
                        type: "person",
                        children: []
                      },
                    ]
                  }
                ],
              }],
          }
        ]
      },
      {
        label: "EthioCTO",
        data: { id: 2, parentId: 1, title: "CTO", employee: ["Jane Smith"], description: "Oversees the company's technology and IT operations.", assignedEmployee: "Jane Smith" },
        expanded: true,
        styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
        type: "person",
        children: [
          {
            label: "EthioManager1",
            data: { id: 3, parentId: 2, title: "Manager 1", employee: ["Alex Johnson"], description: "Manages a team of developers and ensures project delivery.", assignedEmployee: "Alex Johnson" },
            expanded: true,
            styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
            type: "person",
            children: [
              {
                label: "EthioSupervisor1",
                data: { id: 4, parentId: 3, title: "Supervisor 1", employee: ["Emily Brown"], description: "Supervises a group of developers and coordinates their tasks.", assignedEmployee: "Emily Brown" },
                expanded: true,
                styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
                type: "person",
                children: [
                  {
                    label: "EthioTeamLead1",
                    data: { id: 5, parentId: 4, title: "Team Lead 1", employee: ["Michael Wilson"], description: "Leads a development team and oversees project execution.", assignedEmployee: "Michael Wilson" },
                    expanded: true,
                    styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
                    type: "person",
                    children: [
                      {
                        label: "EthioDeveloper1",
                        data: { id: 6, parentId: 5, title: "Developer 1", employee: [], description: "Responsible for coding and implementing software solutions.", assignedEmployee: "" },
                        expanded: true,
                        styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
                        type: "person",
                        children: []
                      },
                      {
                        label: "EthioQA1",
                        data: { id: 7, parentId: 5, title: "Quality Assurance 1", employee: [], description: "Ensures the quality and reliability of software through testing.", assignedEmployee: "" },
                        expanded: true,
                        styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
                        type: "person",
                        children: []
                      }
                    ]
                  },
                  {
                    label: "EthioTeamLead2",
                    data: { id: 8, parentId: 4, title: "Team Lead 2", employee: ["Sarah Davis"], description: "Leads another development team and oversees project execution.", assignedEmployee: "Sarah Davis" },
                    expanded: true,
                    styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
                    type: "person",
                    children: [
                      {
                        label: "EthioDeveloper2",
                        data: { id: 9, parentId: 8, title: "Developer 2", employee: [], description: "Responsible for coding and implementing software solutions.", assignedEmployee: "" },
                        expanded: true,
                        styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
                        type: "person",
                        children: []
                      },
                    ]
                  }
                ],
              }],
          }
        ]
      }
    ]
  }
]