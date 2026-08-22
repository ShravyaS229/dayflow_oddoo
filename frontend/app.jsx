import "./App.css";

function App() {
  const employees = [
    {
      id: "EMP001",
      name: "Rahul Kumar",
      basic: "₹30,000",
      gross: "₹45,000",
      deduction: "₹3,000",
      net: "₹42,000",
    },
    {
      id: "EMP002",
      name: "Priya Sharma",
      basic: "₹35,000",
      gross: "₹50,000",
      deduction: "₹4,000",
      net: "₹46,000",
    },
    {
      id: "EMP003",
      name: "Arjun Rao",
      basic: "₹28,000",
      gross: "₹40,000",
      deduction: "₹2,500",
      net: "₹37,500",
    },
    {
      id: "EMP004",
      name: "Ananya Singh",
      basic: "₹40,000",
      gross: "₹58,000",
      deduction: "₹5,000",
      net: "₹53,000",
    },
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>Dayflow</h1>
        <p>HRMS</p>

        <nav>
          <div>Dashboard</div>
          <div>Employees</div>
          <div>Attendance</div>
          <div>Leave</div>
          <div className="active">Payroll</div>
          <div>Analytics</div>
          <div>Reports</div>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <h2>Payroll Dashboard</h2>
            <p>Manage employee salaries and payroll information</p>
          </div>

          <button>August 2026 ▾</button>
        </header>

        <section className="cards">
          <div className="card">
            <span>Total Employees</span>
            <h3>120</h3>
            <small>Active employees</small>
          </div>

          <div className="card">
            <span>Total Payroll</span>
            <h3>₹52.4L</h3>
            <small>This month</small>
          </div>

          <div className="card">
            <span>Average Salary</span>
            <h3>₹43,667</h3>
            <small>Per employee</small>
          </div>

          <div className="card">
            <span>Total Deductions</span>
            <h3>₹4.8L</h3>
            <small>This month</small>
          </div>
        </section>

        <section className="grid">
          <div className="panel">
            <h3>Payroll Overview</h3>
            <p>Monthly payroll expenditure</p>

            <div className="chart">
              <div style={{ height: "45%" }}><span>Jan</span></div>
              <div style={{ height: "55%" }}><span>Feb</span></div>
              <div style={{ height: "62%" }}><span>Mar</span></div>
              <div style={{ height: "70%" }}><span>Apr</span></div>
              <div style={{ height: "82%" }}><span>May</span></div>
              <div style={{ height: "90%" }}><span>Jun</span></div>
            </div>
          </div>

          <div className="panel">
            <h3>Payroll Summary</h3>

            <div className="summary">
              <p>Gross Salary <strong>₹57.2L</strong></p>
              <p>Deductions <strong>₹4.8L</strong></p>
              <p>Net Payroll <strong>₹52.4L</strong></p>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="table-header">
            <div>
              <h3>Employee Payroll</h3>
              <p>Salary details for August 2026</p>
            </div>

            <button>Export Report</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Basic Salary</th>
                <th>Gross Salary</th>
                <th>Deductions</th>
                <th>Net Salary</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <strong>{employee.name}</strong>
                    <small>{employee.id}</small>
                  </td>
                  <td>{employee.basic}</td>
                  <td>{employee.gross}</td>
                  <td>{employee.deduction}</td>
                  <td><strong>{employee.net}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default App;