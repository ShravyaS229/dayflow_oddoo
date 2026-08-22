import { useState, type FormEvent } from "react";
import "./App.css";

const API_BASE_URL = "http://localhost:5000";

type AuthUser = {
  email: string;
  role: string;
};

type AuthSession = {
  token: string;
  user: AuthUser;
};

export const authenticatedFetch = (
  token: string,
  input: RequestInfo | URL,
  init: RequestInit = {}
) => {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(input, {
    ...init,
    headers,
  });
};

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
  const [session, setSession] = useState<AuthSession | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
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

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Login failed");
      }

      setSession(payload.data);
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "Unable to connect to the server"
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!session) {
    return (
      <main className="main-content">
        <section className="content-card form-card">
          <h1>Sign in to Dayflow</h1>
          <p>Use your Dayflow account to continue.</p>

          <form onSubmit={handleLogin}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            {loginError && <p role="alert">{loginError}</p>}

            <button type="submit" className="primary-btn" disabled={isLoggingIn}>
              {isLoggingIn ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </section>
      </main>
    );
  }

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
          <strong>{session.user.email}</strong>
          <span>{session.user.role}</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Leave & Approval</h1>
            <p>Manage your leave requests and approvals.</p>
          </div>

          <div className="profile">
            <div className="avatar">{session.user.email.charAt(0).toUpperCase()}</div>
            <div>
              <strong>{session.user.email}</strong>
              <span>{session.user.role}</span>
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
                (leave) => leave.employee === session.user.email
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