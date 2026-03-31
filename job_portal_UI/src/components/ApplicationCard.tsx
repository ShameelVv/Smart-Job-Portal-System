function ApplicationCard({app}:any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <h2 className="text-lg font-semibold text-gray-800">
       {app.job_title}
      </h2>

      <p className="text-gray-600">{app.company}</p>

      <p className="mt-2 text-sm text-blue-600">
        {app.status}
      </p>

      <p className="text-xs text-gray-400 mt-1">
       {app.applied_on}
      </p>

    </div>
  );
}

export default ApplicationCard;