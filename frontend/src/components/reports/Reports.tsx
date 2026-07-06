import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ReportItem } from '../../models/ReportItem'
import { downloadLikesCsv, getLikesReport } from '../../services/reports-service'
import extractError from '../../services/extract-error'
import './Reports.css'

export default function Reports() {
  const [report, setReport] = useState<ReportItem[]>([])

  useEffect(() => {
    getLikesReport()
      .then(setReport)
      .catch(error => toast.error(extractError(error)))
  }, [])

  return (
    <section className="panel wide">
      <div className="page-title">
        <div>
          <p className="eyebrow">Admin only</p>
          <h1>Vacations Report</h1>
        </div>
        <button onClick={() => downloadLikesCsv().catch(error => toast.error(extractError(error)))}>Download CSV</button>
      </div>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={report}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="destination" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="likesCount" name="Likes" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
