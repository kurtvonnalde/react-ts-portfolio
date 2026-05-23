import PortfolioChat from '../../components/PortfolioChat';
import './About.css';

export default function About() {
  const initialMessages = [
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Hi! I am Krawl, Kurt\'s AI Assistant. Ask me anything about Kurt\'s skills, experience, projects, or background!',
      timestamp: new Date()
    }
  ];

  return (
    <div className="about-page">
      <PortfolioChat initialMessages={initialMessages} />
    </div>
  );
}