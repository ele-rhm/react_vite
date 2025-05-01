import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const VaccineHesitancyDashboard = () => {
  // Sample data - in a real implementation, this would be loaded from simulation results
  const [simulationData] = useState({
    overallResults: [
      { name: "Yes", value: 45 },
      { name: "No", value: 35 },
      { name: "Maybe", value: 20 },
    ],
    factorImpact: [
      {
        name: "Source Credibility",
        factual: 75,
        misinformation: 30,
        conspiracy: 15,
      },
      {
        name: "Political Alignment",
        factual: 60,
        misinformation: 45,
        conspiracy: 25,
      },
      {
        name: "Prior Beliefs",
        factual: 80,
        misinformation: 65,
        conspiracy: 50,
      },
      {
        name: "Health Literacy",
        factual: 85,
        misinformation: 40,
        conspiracy: 20,
      },
    ],
    agentProfiles: [
      {
        id: "AGENT_001",
        name: "James Wilson",
        age: 42,
        education: "Bachelor's degree",
        political: "Moderate",
        priorAttitude: "Generally pro-vaccine",
        responseToFactual: "Yes",
        responseToMisinfo: "Maybe",
      },
      {
        id: "AGENT_002",
        name: "Maria Rodriguez",
        age: 35,
        education: "Master's degree",
        political: "Liberal",
        priorAttitude: "Very pro-vaccine",
        responseToFactual: "Yes",
        responseToMisinfo: "Yes",
      },
      {
        id: "AGENT_003",
        name: "Robert Kim",
        age: 67,
        education: "High school diploma",
        political: "Conservative",
        priorAttitude: "Somewhat hesitant",
        responseToFactual: "Maybe",
        responseToMisinfo: "No",
      },
      {
        id: "AGENT_004",
        name: "Emily Nguyen",
        age: 29,
        education: "PhD",
        political: "Very liberal",
        priorAttitude: "Generally pro-vaccine",
        responseToFactual: "Yes",
        responseToMisinfo: "Maybe",
      },
      {
        id: "AGENT_005",
        name: "David Singh",
        age: 55,
        education: "Some college",
        political: "Very conservative",
        priorAttitude: "Anti-vaccine",
        responseToFactual: "No",
        responseToMisinfo: "No",
      },
    ],
    infoSourceImpact: [
      { name: "CNN", yes: 65, maybe: 25, no: 10 },
      { name: "Fox News", yes: 30, maybe: 30, no: 40 },
      { name: "Social Media", yes: 20, maybe: 35, no: 45 },
      { name: "Scientific Journal", yes: 80, maybe: 15, no: 5 },
      { name: "Alt Health Blog", yes: 15, maybe: 25, no: 60 },
    ],
    attitudeChanges: [
      { name: "More Positive", value: 15 },
      { name: "No Change", value: 65 },
      { name: "More Negative", value: 20 },
    ],
  });

  const [activeTab, setActiveTab] = useState("overview");

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  const decisionColors = {
    Yes: "#00C49F",
    No: "#FF8042",
    Maybe: "#FFBB28",
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="flex p-2 space-x-1">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "overview"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "agents"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("agents")}
          >
            Agent Profiles
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "sources"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("sources")}
          >
            Information Sources
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "factors"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("factors")}
          >
            Influencing Factors
          </button>
        </div>
      </nav>

      <main className="flex-grow p-4 overflow-auto">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">
                Overall Vaccine Acceptance
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={simulationData.overallResults}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {simulationData.overallResults.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            decisionColors[entry.name as keyof typeof decisionColors] ||
                            COLORS[index % COLORS.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">
                Attitude Changes After Exposure
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={simulationData.attitudeChanges}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {simulationData.attitudeChanges.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">
                Information Source Impact on Decisions
              </h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={simulationData.infoSourceImpact}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="yes"
                      name="Would Take Vaccine"
                      stackId="a"
                      fill={decisionColors["Yes"]}
                    />
                    <Bar
                      dataKey="maybe"
                      name="Might Take Vaccine"
                      stackId="a"
                      fill={decisionColors["Maybe"]}
                    />
                    <Bar
                      dataKey="no"
                      name="Would Not Take Vaccine"
                      stackId="a"
                      fill={decisionColors["No"]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "agents" && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              Agent Profiles and Responses
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Agent
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Demographics
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Beliefs
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Response to Factual
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Response to Misinfo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {simulationData.agentProfiles.map((agent) => (
                    <tr key={agent.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {agent.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {agent.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Age: {agent.age}
                        </div>
                        <div className="text-sm text-gray-500">
                          Education: {agent.education}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Politics: {agent.political}
                        </div>
                        <div className="text-sm text-gray-500">
                          Prior: {agent.priorAttitude}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            agent.responseToFactual === "Yes"
                              ? "bg-green-100 text-green-800"
                              : agent.responseToFactual === "No"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {agent.responseToFactual}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            agent.responseToMisinfo === "Yes"
                              ? "bg-green-100 text-green-800"
                              : agent.responseToMisinfo === "No"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {agent.responseToMisinfo}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "sources" && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              Information Sources Analysis
            </h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={simulationData.infoSourceImpact}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="yes"
                    name="Would Take Vaccine"
                    stackId="a"
                    fill={decisionColors["Yes"]}
                  />
                  <Bar
                    dataKey="maybe"
                    name="Might Take Vaccine"
                    stackId="a"
                    fill={decisionColors["Maybe"]}
                  />
                  <Bar
                    dataKey="no"
                    name="Would Not Take Vaccine"
                    stackId="a"
                    fill={decisionColors["No"]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium mb-2">Key Insights:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Scientific journals show highest vaccine acceptance rates
                  (80%)
                </li>
                <li>
                  Social media and alternative health blogs correlate with
                  higher hesitancy
                </li>
                <li>
                  Mainstream news sources show varied results, potentially split
                  along political lines
                </li>
                <li>
                  Source credibility appears to be a significant factor in
                  decision-making
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "factors" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">
                Factor Impact on Vaccine Acceptance
              </h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={simulationData.factorImpact}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      label={{
                        value: "Acceptance Rate (%)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="factual"
                      name="Factual Content"
                      fill="#0088FE"
                    />
                    <Bar
                      dataKey="misinformation"
                      name="Misinformation"
                      fill="#FF8042"
                    />
                    <Bar
                      dataKey="conspiracy"
                      name="Conspiracy Theories"
                      fill="#8884d8"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">
                Demographic Factors Analysis
              </h2>
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Education Level Impact:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Higher education correlates with greater acceptance of
                    factual information
                  </li>
                  <li>
                    PhD/Master's level education shows 85% acceptance rate with
                    factual sources
                  </li>
                  <li>
                    Education appears to provide some resistance against
                    misinformation
                  </li>
                  <li>
                    High school or less education shows more varied responses
                  </li>
                </ul>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Age Group Impact:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Adults 25-44 show highest acceptance rates (60%)</li>
                  <li>Seniors 65+ show more polarized responses</li>
                  <li>Young adults 18-24 show more social media influence</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">
                Psychological Factors Analysis
              </h2>
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Prior Beliefs Impact:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Strong correlation between prior attitudes and final
                    decisions
                  </li>
                  <li>
                    Already vaccine-hesitant individuals more influenced by
                    negative news
                  </li>
                  <li>
                    Pro-vaccine individuals more resistant to misinformation
                  </li>
                  <li>
                    Neutral individuals show most significant attitude shifts
                  </li>
                </ul>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Trust in Institutions:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    High trust correlates with 75% vaccine acceptance regardless
                    of news source
                  </li>
                  <li>
                    Low trust correlates with greater susceptibility to negative
                    information
                  </li>
                  <li>
                    Medium trust individuals show most varied responses based on
                    source credibility
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VaccineHesitancyDashboard;