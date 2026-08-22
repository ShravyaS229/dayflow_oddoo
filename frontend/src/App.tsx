import { useState } from "react";
import "./App.css";

function App() {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      leaveType,
      startDate,
      endDate,
      reason,
    });

    alert("Leave application submitted!");
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Dayflow HRMS</h1>
        <p>Leave & Approval Workflow</p>
      </header>

      <main className="main-content">
        <section className="leave-card">
          <h2>Apply for Leave</h2>
          <p className="subtitle">
            Submit a leave request for HR approval.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Leave Type</label>

              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                required
              >
                <option value="">Select leave type</option>
                <option value="Paid Leave">Paid Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
              </select>
            </div>

            <div className="date-row">
              <div className="form-group">
                <label>Start Date</label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Date</label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Reason</label>

              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for leave"
                rows={4}
                required
              />
            </div>

            <button type="submit" className="submit-button">
              Apply Leave
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;