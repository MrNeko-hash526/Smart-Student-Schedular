export default function Calendar() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
        <p className="text-gray-600">View and manage your study schedule.</p>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[400px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium mb-2">Calendar View</p>
          <p className="text-sm">Interactive calendar with study sessions will be implemented here.</p>
        </div>
      </div>
    </div>
  );
}
