import { useState } from 'react';
import './App.css';
import NoFormLibrary from './pages/NoFormLibrary';
import FormLibrary from './pages/FormLibrary';

type Tab = "no-library" | "form-library";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("form-library");

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Product Management System</h1>
        <p className="app-subtitle">Create and manage your products with ease</p>
      </header>

      <div className="tabs-container">
        <nav className="tabs-nav" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "no-library"}
            aria-controls="no-library-panel"
            onClick={() => setActiveTab("no-library")}
            className={`tab-button ${activeTab === "no-library" ? "active" : ""}`}
          >
            <span className="tab-icon">📝</span>
            Manual Form
            <span className="tab-description">Uses UseState implementation</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "form-library"}
            aria-controls="form-library-panel"
            onClick={() => setActiveTab("form-library")}
            className={`tab-button ${activeTab === "form-library" ? "active" : ""}`}
          >
            <span className="tab-icon">⚡</span>
            React Hook Form + Zod
            <span className="tab-description">Uses React-Hook-Form Library and zod</span>
          </button>
        </nav>

        <div className="tab-content">
          <div
            role="tabpanel"
            id="no-library-panel"
            aria-labelledby="no-library-tab"
            hidden={activeTab !== "no-library"}
          >
            {activeTab === "no-library" && <NoFormLibrary />}
          </div>

          <div
            role="tabpanel"
            id="form-library-panel"
            aria-labelledby="form-library-tab"
            hidden={activeTab !== "form-library"}
          >
            {activeTab === "form-library" && <FormLibrary />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;