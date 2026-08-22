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

  // Apply Leave form state
  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  // Leave requests
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
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

  // Dashboard counts
  const pendingCount = leaveRequests.filter(
    (leave) => leave.status === "Pending"
  ).length;

  const approvedCount = leaveRequests.filter(
    (leave) => leave.status === "Approved"
  ).length;

  const rejectedCount = leaveRequests.filter(
    (leave) => leave.status === "Rejected"
  ).length;

  // Approve / Reject leave
  const updateLeaveStatus = (
    id: number,
    status: LeaveStatus
  ) => {
    setLeaveRequests((requests) =>
      requests.map((leave) =>
        leave.id === id
          ? { ...leave, status }
          : leave
      )
    );
  };

  // Submit new leave request
  const handleLeaveSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!leaveType || !fromDate || !toDate || !reason.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    if (toDate < fromDate) {
      alert("To date cannot be before From date.");
      return;
    }

    const newLeaveRequest: LeaveRequest = {
      id: Date.now(),
      employee: "Srishti",
      leaveType,
      from: fromDate,
      to: toDate,
      reason: reason.trim(),
      status: "Pending",
    };

    setLeaveRequests((requests) => [
      ...requests,
      newLeaveRequest,
    ]);

    // Clear form
    setLeaveType("");
    setFromDate("");
    setToDate("");
    setReason("");

    alert("Leave request submitted successfully!");

    // Go to My Leaves
    setActivePage("my-leaves");
  };

  return (
    <div className="app">
      {/* SIDEBAR */}
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
            className={
              activePage === "dashboard"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={
              activePage === "my-leaves"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("my-leaves")}
          >
            My Leaves
          </button>

          <button
            className={
              activePage === "approvals"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage("approvals")}
          >
            Leave Approvals
          </button>

          <button
            className={
              activePage === "apply-leave"
                ? "nav-item active"
                : "nav-item"
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

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* TOP BAR */}
        <header className="topbar">
          <div>
            <h1>Leave & Approval</h1>
            <p>
              Manage your leave requests and approvals.
            </p>
          </div>

          <div className="profile">
            <div className="avatar">S</div>

            <div>
              <strong>Srishti</strong>
              <span>Employee</span>
            </div>
          </div>
        </header>

        {/* DASHBOARD */}
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
                  <p>
                    Overview of submitted leave requests.
                  </p>
                </div>

                <button
                  className="primary-btn"
                  onClick={() =>
                    setActivePage("apply-leave")
                  }
                >
                  + Apply Leave
                </button>
              </div>

              <LeaveTable requests={leaveRequests} />
            </section>
          </>
        )}

        {/* MY LEAVES */}
        {activePage === "my-leaves" && (
          <section className="content-card">
            <div className="section-header">
              <div>
                <h2>My Leave Requests</h2>
                <p>
                  Track the status of your submitted requests.
                </p>
              </div>

              <button
                className="primary-btn"
                onClick={() =>
                  setActivePage("apply-leave")
                }
              >
                + Apply Leave
              </button>
            </div>

            <LeaveTable
              requests={leaveRequests.filter(
                (leave) => leave.employee === "Srishti"
              )}
            />
          </section>
        )}

        {/* LEAVE APPROVALS */}
        {activePage === "approvals" && (
          <section className="content-card">
            <div className="section-header">
              <div>
                <h2>Leave Approvals</h2>
                <p>
                  Review employee leave requests.
                </p>
              </div>
            </div>

            <LeaveTable
              requests={leaveRequests}
              showActions
              onStatusChange={updateLeaveStatus}
            />
          </section>
        )}

        {/* APPLY LEAVE */}
        {activePage === "apply-leave" && (
          <section className="content-card form-card">
            <h2>Apply for Leave</h2>

            <p>
              Submit a new leave request.
            </p>

            <form onSubmit={handleLeaveSubmit}>
              {/* LEAVE TYPE */}
              <label>
                Leave Type

                <select
                  value={leaveType}
                  onChange={(event) =>
                    setLeaveType(event.target.value)
                  }
                  required
                >
                  <option value="">
                    Select leave type
                  </option>

                  <option value="Casual Leave">
                    Casual Leave
                  </option>

                  <option value="Sick Leave">
                    Sick Leave
                  </option>

                  <option value="Earned Leave">
                    Earned Leave
                  </option>
                </select>
              </label>

              {/* DATES */}
              <div className="form-row">
                <label>
                  From

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(event) =>
                      setFromDate(event.target.value)
                    }
                    required
                  />
                </label>

                <label>
                  To

                  <input
                    type="date"
                    value={toDate}
                    onChange={(event) =>
                      setToDate(event.target.value)
                    }
                    required
                  />
                </label>
              </div>

              {/* REASON */}
              <label>
                Reason

                <textarea
                  value={reason}
                  onChange={(event) =>
                    setReason(event.target.value)
                  }
                  placeholder="Enter reason for leave..."
                  required
                />
              </label>

              {/* SUBMIT */}
              <button
                type="submit"
                className="primary-btn"
              >
                Submit Leave Request
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

/* LEAVE TABLE */

function LeaveTable({
  requests,
  showActions = false,
  onStatusChange,
}: {
  requests: LeaveRequest[];
  showActions?: boolean;
  onStatusChange?: (
    id: number,
    status: LeaveStatus
  ) => void;
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
          {requests.length === 0 ? (
            <tr>
              <td
                colSpan={showActions ? 7 : 6}
                className="muted"
              >
                No leave requests found.
              </td>
            </tr>
          ) : (
            requests.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.employee}</td>

                <td>{leave.leaveType}</td>

                <td>{leave.from}</td>

                <td>{leave.to}</td>

                <td>{leave.reason}</td>

                <td>
                  <span
                    className={`status ${leave.status.toLowerCase()}`}
                  >
                    {leave.status}
                  </span>
                </td>

                {showActions && (
                  <td>
                    {leave.status === "Pending" ? (
                      <div className="actions">
                        <button
                          className="approve-btn"
                          onClick={() =>
                            onStatusChange?.(
                              leave.id,
                              "Approved"
                            )
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() =>
                            onStatusChange?.(
                              leave.id,
                              "Rejected"
                            )
                          }
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="muted">
                        No action
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;