function ApplicationCard({app}:any) {
  return (
    <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg shadow-violet-100 border border-violet-100 hover:shadow-xl hover:shadow-violet-200 transition-all duration-300">

      <h2 className="text-lg font-semibold text-gray-900">
       {app.job_title}
      </h2>

      <p className="text-gray-500">{app.company}</p>

      <p className="mt-2 text-sm font-semibold text-violet-700 bg-violet-50 inline-block px-3 py-1 rounded-full border border-violet-100">
        {app.status}
      </p>

      <p className="text-xs text-gray-400 mt-2">
       {app.applied_on}
      </p>

    </div>
  );
}

export default ApplicationCard;