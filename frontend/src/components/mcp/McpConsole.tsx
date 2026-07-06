import { Database, Search } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { askMcp } from '../../services/mcp-service'
import extractError from '../../services/extract-error'
import Markdown from '../common/markdown/Markdown'
import SpinnerButton from '../common/spinner-button/SpinnerButton'
import './McpConsole.css'

const examples = [
  'How many active vacations exist right now?',
  'What is the average vacation price?',
  'Which upcoming Europe vacations exist?',
  'What is the cheapest vacation?',
  'What is the most expensive vacation?',
  'Which vacation has the most likes?',
  'Show me vacations under $2,000'
]

export default function McpConsole() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)

    try {
      setAnswer(await askMcp(question))
    } catch (error) {
      toast.error(extractError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="panel">
      <p className="eyebrow">Live vacation data</p>

      <h1>Travel data assistant</h1>

      <p className="hint">
        Ask any read-only question about the current Voyanta database.
        You can compare prices, dates, statuses, popularity, totals,
        and destinations through the platform&apos;s MCP server.
      </p>

      <div className="chips">
        {examples.map(example => (
          <button
            type="button"
            key={example}
            onClick={() => setQuestion(example)}
          >
            <Database size={16} />
            {example}
          </button>
        ))}
      </div>

      <form onSubmit={submit}>
        <label htmlFor="travel-data-question">
          Question
        </label>

        <textarea
          id="travel-data-question"
          value={question}
          onChange={event => setQuestion(event.target.value)}
          required
        />

        <SpinnerButton loading={loading}>
          <Search size={18} />
          Ask Voyanta
        </SpinnerButton>
      </form>

      {answer && (
        <div className="mcp-answer">
          <Markdown text={answer} />
        </div>
      )}
    </section>
  )
}
