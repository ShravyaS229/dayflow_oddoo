import { useState } from "react";
import "./App.css";

type LeaveStatus = "Pending" | "Approved" | "Rejected";

type LeaveRequest = {
  id: number;
  employee: string;
  leaveType: string;
  from: string;
  to: string;
  reason: string;
  status: LeaveStatus;
};

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [leaveRequests] = useState<LeaveRequest[]>([
    {
      id: 1,
      employee: "Srishti",
      leaveType: "Casual Leave",
      from: "22 Aug 2026",
      to: "23 Aug 2026",
      reason: "Personal work",
      status: "Pending",
    },
    {
      id: 2,
      employee: "Rahul",
      leaveType: "Sick Leave",
      from: "20 Aug 2026",
      to: "20 Aug 2026",
      reason: "Not feeling well",
      status: "Approved",
    },
    {
      id: 3,
      employee: "Ananya",
      leaveType: "Earned Leave",
      from: "25 Aug 2026",
      to: "27 Aug 2026",
      reason: "Family function",
      status: "Rejected",
    },
  ]);

  const pendingCount = leaveRequests.filter(
    (leave) => leave.status === "Pending"
  ).length;

  const approvedCount = leaveRequests.filter(
    (leave) => leave.status === "Approved"
  ).length;

  const rejectedCount = leaveRequests.filter(
    (leave) => leave.status === "Rejected"
  ).length;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-box">D</div>
          <div>
            <h2>Dayflow</h2>
            <p>HRMS</p>
          </div>
        </div>

        <nav>
          <button
            className={activePage === "dashboard" ? "nav-item active" : "nav-item"}
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={activePage === "my-leaves" ? "nav-item active" : "nav-item"}
            onClick={() => setActivePage("my-leaves")}
          >
            My Leaves
          </button>

          <button
            className={
              activePage === "approvals" ? "nav-item active" : "nav-item"
            }
            onClick={() => setActivePage("approvals")}
          >
            Leave Approvals
          </button>

          <button
            className={
              activePage === "apply-leave" ? "nav-item active" : "nav-item"
            }
            onClick={() => setActivePage("apply-leave")}
          >
            Apply Leave
          </button>
        </nav>

        <div className="sidebar-bottom">
          <p>Logged in as</p>
          <strong>Srishti</strong>
          <span>Employee</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Leave & Approval</h1>
            <p>Manage your leave requests and approvals.</p>
          </div>

          <div className="profile">
            <div className="avatar">S</div>
            <div>
              <strong>Srishti</strong>
              <span>Employee</span>
            </div>
          </div>
        </header>

        {activePage === "dashboard" && (
          <>
            <section className="stats">
              <div className="stat-card">
                <span>Pending Requests</span>
                <strong>{pendingCount}</strong>
              </div>

              <div className="stat-card">
                <span>Approved</span>
                <strong>{approvedCount}</strong>
              </div>

              <div className="stat-card">
                <span>Rejected</span>
                <strong>{rejectedCount}</strong>
              </div>
            </section>

            <section className="content-card">
              <div className="section-header">
                <div>
                  <h2>Recent Leave Requests</h2>
                  <p>Overview of submitted leave requests.</p>
                </div>

                <button
                  className="primary-btn"
                  onClick={() => setActivePage("apply-leave")}
                >
                  + Apply Leave
                </button>
              </div>

              <LeaveTable requests={leaveRequests} />
            </section>
          </>
        )}

        {activePage === "my-leaves" && (
          <section className="content-card">
            <div className="section-header">
              <div>
                <h2>My Leave Requests</h2>
                <p>Track the status of your submitted requests.</p>
              </div>
            </div>

            <LeaveTable
              requests={leaveRequests.filter(
                (leave) => leave.employee === "Srishti"
              )}
            />
          </section>
        )}

        {activePage === "approvals" && (
          <section className="content-card">
            <div className="section-header">
              <div>
                <h2>Leave Approvals</h2>
                <p>Review employee leave requests.</p>
              </div>
            </div>

            <LeaveTable requests={leaveRequests} showActions />
          </section>
        )}

        {activePage === "apply-leave" && (
          <section className="content-card form-card">
            <h2>Apply for Leave</h2>
            <p>Submit a new leave request.</p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                alert("Leave request submitted successfully!");
              }}
            >
              <label>
                Leave Type
                <select required>
                  <option value="">Select leave type</option>
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Earned Leave</option>
                </select>
              </label>

              <div className="form-row">
                <label>
                  From
                  <input type="date" required />
                </label>

                <label>
                  To
                  <input type="date" required />
                </label>
              </div>

              <label>
                Reason
                <textarea
                  placeholder="Enter reason for leave..."
                  required
                />
              </label>

              <button type="submit" className="primary-btn">
                Submit Leave Request
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

function LeaveTable({
  requests,
  showActions = false,
}: {
  requests: LeaveRequest[];
  showActions?: boolean;
}) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
            {showActions && <th>Action</th>}
          </tr>
        </thead>

        <tbody>
          {requests.map((leave) => (
            <tr key={leave.id}>
              <td>{leave.employee}</td>
              <td>{leave.leaveType}</td>
              <td>{leave.from}</td>
              <td>{leave.to}</td>
              <td>{leave.reason}</td>
              <td>
                <span className={`status ${leave.status.toLowerCase()}`}>
                  {leave.status}
                </span>
              </td>

              {showActions && (
                <td>
                  {leave.status === "Pending" ? (
                    <div className="actions">
                      <button className="approve-btn">Approve</button>
                      <button className="reject-btn">Reject</button>
                    </div>
                  ) : (
                    <span className="muted">No action</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;