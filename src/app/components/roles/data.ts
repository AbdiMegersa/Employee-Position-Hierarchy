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
            label: "EthioSupervisor1",
            data: { id: 4, parentId: 3, title: "Supervisor 1", employee: ["Emily Brown"], description: "Supervises a group of developers and coordinates their tasks.", assignedEmployee: "Emily Brown" },
            expanded: true,
            styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
            type: "person",
            children: [
              {
                label: "EthioTeamLead2",
                data: { id: 8, parentId: 4, title: "Team Lead 2", employee: ["Sarah Davis"], description: "Leads another development team and oversees project execution.", assignedEmployee: "Sarah Davis" },
                expanded: true,
                styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
                type: "person",
                children: [
           
                ]
              }
            ],
          },
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
            label: "EthioSupervisor1",
            data: { id: 4, parentId: 3, title: "Supervisor 1", employee: ["Emily Brown"], description: "Supervises a group of developers and coordinates their tasks.", assignedEmployee: "Emily Brown" },
            expanded: true,
            styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
            type: "person",
            children: [
              {
                label: "EthioTeamLead2",
                data: { id: 8, parentId: 4, title: "Team Lead 2", employee: ["Sarah Davis"], description: "Leads another development team and oversees project execution.", assignedEmployee: "Sarah Davis" },
                expanded: true,
                styleClass: "p-2 bg-blue-200 text-gray-800 rounded-lg shadow-lg hover:bg-blue-300",
                type: "person",
                children: [
           
                ]
              }
            ],
          },
        ]
      }
    ]
  }
]
        