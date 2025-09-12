export default function Schedule() {
  const schedules = [
    {
      route: "01A",
      origin: "Cebu City Proper",
      destination: "Mandaue City",
      firstTrip: "5:00 AM",
      lastTrip: "10:00 PM",
      frequency: "Every 10-15 mins",
    },
    {
      route: "02B",
      origin: "Cebu City Proper",
      destination: "Lapu-Lapu City",
      firstTrip: "5:30 AM",
      lastTrip: "9:30 PM",
      frequency: "Every 20 mins",
    },
    {
      route: "12",
      origin: "Cebu City Proper",
      destination: "Talisay City",
      firstTrip: "4:30 AM",
      lastTrip: "9:00 PM",
      frequency: "Every 15 mins",
    },
    {
      route: "10H",
      origin: "Carbon Market",
      destination: "Talamban",
      firstTrip: "6:00 AM",
      lastTrip: "9:00 PM",
      frequency: "Every 12 mins",
    },
  ];

  return (
    <div className="p-8 ml-60 ">
      <h1 className="text-3xl font-bold text-[#23B1B7] mb-2">Jeepney Schedule</h1>
      <p className="text-gray-600 mb-6">Operating hours and trip intervals for Cebu City jeepney routes.</p>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-xl overflow-hidden">
          <thead className="bg-[#23B1B7] text-white text-left">
            <tr>
              <th className="px-6 py-3">Route</th>
              <th className="px-6 py-3">Origin</th>
              <th className="px-6 py-3">Destination</th>
              <th className="px-6 py-3">First Trip</th>
              <th className="px-6 py-3">Last Trip</th>
              <th className="px-6 py-3">Frequency</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 divide-y divide-gray-200">
            {schedules.map((route) => (
              <tr key={route.route} className="hover:bg-teal-50 transition">
                <td className="px-6 py-4 font-bold text-[#23B1B7]">Route {route.route}</td>
                <td className="px-6 py-4">{route.origin}</td>
                <td className="px-6 py-4">{route.destination}</td>
                <td className="px-6 py-4">{route.firstTrip}</td>
                <td className="px-6 py-4">{route.lastTrip}</td>
                <td className="px-6 py-4">{route.frequency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
