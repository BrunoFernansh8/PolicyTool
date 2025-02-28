import "./App.css";

export default function App() {
  const openPostman = () => {
    window.open("https://www.postman.co/", "_blank");
  };
  return (
    <div id="app">
      <div id="title">
        <h1>Policy & Risk Assessment</h1>
        <h2>Your Virtual Assistant</h2>
        <h2>Guiding you to Cloud Security!</h2>
      </div>
      <img src="./assets/Robot.png" alt="Robot" id="robot-image" />
      <div id="body-section">
        <section id="left-section">
          <h3>Top 10 Cloud Security Risks</h3>
          <ol>
            <li>Data Security Vulnerability</li>
            <li>Compliance Challenges</li>
            <li>Inadequate Multi-Cloud Management Strategy</li>
            <li>Non-Authenticated API Access</li>
            <li>Shortage of Cybersecurity Experts</li>
            <li>Client Separation Control Issues</li>
            <li>Human Error</li>
            <li>Misconfiguration</li>
            <li>Data Breaches</li>
            <li>Advanced Persistent Threats (APTs)</li>
            <a 
            href="https://www.sentinelone.com/cybersecurity-101/cloud-security/cloud-security-risks/#:~:text=Top%2010%20Cloud%20Security%20Risks%201%20%231%20Data,...%208%20%2310%20Advanced%20Persistent%20Threats%20%28APTs%29%20" 
            target="_blank" 
            rel="noopener noreferrer"
            >
              Learn more @SentinelOne
            </a>
          </ol>
          

          <button id="postman-button" onClick={openPostman}>Get Started With <br/>POSTMAN</button>
        </section>
        <section id="right-section">
          <p>
            Want to build a comprehensive security policy? Welcome to a secure platform, 
            where your orgainsation can begin to secure their assets, employees and clients! 
            Secure your cloud environments, and be ready for any type of attack, 
            by creating policies and having strategies in place to detect and fight off attackers! 
            Learn how you can protect your assets and minimise the effects of attacks!
          </p>
          <iframe src="https://www.youtube.com/embed/JyQ_NHwA0QI?si=Sm42_N6480J3TXdn"
                  allowFullScreen/>
        </section>
      </div>
    </div>
  );
}