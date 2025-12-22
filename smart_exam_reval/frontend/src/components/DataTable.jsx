import React from 'react';

export default function DataTable({ columns, data, hoverColor="bg-blue-50 dark:bg-blue-900/20" }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="w-full border-collapse">
        <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-4 text-left">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {data.map((row, idx) => (
            <tr 
              key={idx} 
              className={`
                ${idx % 2 === 0 ? "bg-white dark:bg-slate-950" : "bg-slate-50 dark:bg-slate-900/50"} 
                hover:${hoverColor} transition-colors
              `}
            >
              {Object.values(row).map((val, i) => (
                <td key={i} className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
