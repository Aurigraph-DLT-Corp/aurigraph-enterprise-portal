/**
 * SDK Documentation Page
 *
 * Comprehensive SDK documentation hub with all language guides,
 * gRPC service layer, and advanced production patterns
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Row,
  Col,
  Typography,
  Badge,
  Tabs,
  Tag,
  Space,
  Input,
  Empty,
  Drawer,
  Divider,
  Progress,
  Alert,
  Timeline,
  Steps,
} from 'antd';
import {
  FileTextOutlined,
  GithubOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  BookOutlined,
  CodeOutlined,
  RocketOutlined,
  ShieldOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  SearchOutlined,
  BgColorsOutlined,
  ApiOutlined,
  CloudOutlined,
  LockOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import './SDKPage.css';

const { Title, Paragraph, Text } = Typography;

interface SDKGuide {
  id: string;
  title: string;
  category: string;
  lines: number;
  language?: string;
  description: string;
  features: string[];
  benefits: string[];
  githubPath: string;
  remoteLocation: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  color: string;
  icon: React.ReactNode;
  tags: string[];
}

const SDKPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<SDKGuide | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const sdkGuides: SDKGuide[] = [
    {
      id: 'rest-api',
      title: 'REST API Reference',
      category: 'Priority 1: Core Documentation',
      lines: 1117,
      description: 'Complete REST API endpoint documentation with 50+ endpoints for transactions, assets, and oracle operations.',
      features: [
        'Full endpoint documentation with examples',
        'Authentication methods (OAuth 2.0, JWT, API keys)',
        'Request/response schemas',
        'Error handling and status codes',
        'Rate limiting information',
      ],
      benefits: [
        'Quick integration for REST-based clients',
        'Clear examples for every endpoint',
        'Comprehensive error documentation',
        'Easy API exploration',
        'Perfect for initial prototyping',
      ],
      githubPath: 'https://github.com/Aurigraph-DLT-Corp/Aurigraph-DLT/blob/V12/rwat-sdk-typescript/docs/sdk/REST_API_REFERENCE.md',
      remoteLocation: 'ssh -p 2235 subbu@dlt.aurigraph.io:~/aurigraph-sdk-docs/REST_API_REFERENCE.md',
      difficulty: 'Beginner',
      color: '#1890ff',
      icon: <ApiOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      tags: ['REST', 'HTTP', 'API', 'Beginner'],
    },
    {
      id: 'transactions',
      title: 'Transactions Guide',
      category: 'Priority 1: Core Documentation',
      lines: 1082,
      description: 'Transaction lifecycle, gas estimation, fee calculation, batch processing, and error recovery procedures.',
      features: [
        'Transaction creation and signing',
        'Gas estimation algorithms',
        'Fee calculation and payment methods',
        'Batch transaction processing',
        'Transaction status tracking',
        'Error recovery strategies',
      ],
      benefits: [
        'Complete lifecycle understanding',
        'Optimize transaction costs',
        'Efficient batch operations',
        'Reliable error handling',
        'Production-ready examples',
      ],
      githubPath: 'https://github.com/Aurigraph-DLT-Corp/Aurigraph-DLT/blob/V12/rwat-sdk-typescript/docs/sdk/TRANSACTIONS_GUIDE.md',
      remoteLocation: 'ssh -p 2235 subbu@dlt.aurigraph.io:~/aurigraph-sdk-docs/TRANSACTIONS_GUIDE.md',
      difficulty: 'Intermediate',
      color: '#faad14',
      icon: <ThunderboltOutlined style={{ fontSize: '48px', color: '#faad14' }} />,
      tags: ['Transactions', 'Signing', 'Fees', 'Intermediate'],
    },
    {
      id: 'assets',
      title: 'Asset Registry Guide',
      category: 'Priority 1: Core Documentation',
      lines: 935,
      description: 'Asset registration, tokenization workflows, real estate, commodities, IP assets, dividend distribution, and redemption.',
      features: [
        'Asset registration procedures',
        'Real estate tokenization',
        'Commodity asset management',
        'Intellectual property tokenization',
        'Dividend distribution',
        'Redemption procedures',
      ],
      benefits: [
        'Enable real-world asset tokenization',
        'Multiple asset class support',
        'Compliance-ready workflows',
        'Automated dividend distribution',
        'Enterprise asset management',
      ],
      githubPath: 'https://github.com/Aurigraph-DLT-Corp/Aurigraph-DLT/blob/V12/rwat-sdk-typescript/docs/sdk/ASSET_REGISTRY_GUIDE.md',
      remoteLocation: 'ssh -p 2235 subbu@dlt.aurigraph.io:~/aurigraph-sdk-docs/ASSET_REGISTRY_GUIDE.md',
      difficulty: 'Intermediate',
      color: '#52c41a',
      icon: <BgColorsOutlined style={{ fontSize: '48px', color: '#52c41a' }} />,
      tags: ['Assets', 'Tokenization', 'RWA', 'Intermediate'],
    },
    {
      id: 'oracle',
      title: 'Oracle Integration Guide',
      category: 'Priority 1: Core Documentation',
      lines: 1116,
      description: 'Price feed integration with WebSocket support, multi-oracle aggregation, Merkle proof verification, and data attestation.',
      features: [
        'Price feed WebSocket integration',
        'Multi-oracle data aggregation',
        'Weighted/median/TWAP strategies',
        'Merkle proof verification',
        'Data attestation mechanisms',
        'Real-time price updates',
      ],
      benefits: [
        'Access reliable price feeds',
        'Multiple aggregation strategies',
        'Cryptographic proof verification',
        'Real-time market data',
        'Enterprise-grade reliability',
      ],
      githubPath: 'https://github.com/Aurigraph-DLT-Corp/Aurigraph-DLT/blob/V12/rwat-sdk-typescript/docs/sdk/ORACLE_INTEGRATION_GUIDE.md',
      remoteLocation: 'ssh -p 2235 subbu@dlt.aurigraph.io:~/aurigraph-sdk-docs/ORACLE_INTEGRATION_GUIDE.md',
      difficulty: 'Intermediate',
      color: '#722ed1',
      icon: <GlobalOutlined style={{ fontSize: '48px', color: '#722ed1' }} />,
      tags: ['Oracle', 'Price Feeds', 'Data', 'Intermediate'],
    },
    {
      id: 'python-sdk',
      title: 'Python SDK Guide',
      category: 'Phase 3.5-3.6: SDK Implementation',
      lines: 1245,
      language: 'Python',
      description: 'Complete Python SDK implementation with async/await patterns, connection pooling, and production-ready error handling.',
      features: [
        'Async/await programming model',
        'Connection pooling (10-20 concurrent)',
        'Automatic retry mechanisms',
        'Rate limiting and backoff',
        'Type hints and IDE support',
        'Comprehensive error handling',
      ],
      benefits: [
        'High-performance async operations',
        'Pythonic API design',
        'Enterprise-grade reliability',
        'Easy integration with Python apps',
        'Full IDE autocomplete support',
      ],
      githubPath: 'https://github.com/Aurigraph-DLT-Corp/Aurigraph-DLT/blob/V12/rwat-sdk-typescript/docs/sdk/PYTHON_SDK_GUIDE.md',
      remoteLocation: 'ssh -p 2235 subbu@dlt.aurigraph.io:~/aurigraph-sdk-docs/PYTHON_SDK_GUIDE.md',
      difficulty: 'Intermediate',
      color: '#13c2c2',
      icon: <CodeOutlined style={{ fontSize: '48px', color: '#13c2c2' }} />,
      tags: ['Python', 'SDK', 'Async', 'Intermediate'],
    },
    {
      id: 'go-sdk',
      title: 'Go SDK Guide',
      category: 'Phase 3.5-3.6: SDK Implementation',
      lines: 1198,
      language: 'Go',
      description: 'Complete Go SDK implementation with goroutines, worker pools, and high-performance concurrent operations.',
      features: [
        'Goroutine-based concurrency',
        'Worker pool patterns',
        'Context-based operations',
        'Error wrapping and handling',
        'Zero-allocation patterns',
        'Efficient memory usage',
      ],
      benefits: [
        'Lightning-fast performance',
        'Native concurrency support',
        'Memory-efficient operations',
        'Perfect for microservices',
        'Excellent for high-throughput apps',
      ],
      githubPath: 'https://github.com/Aurigraph-DLT-Corp/Aurigraph-DLT/blob/V12/rwat-sdk-typescript/docs/sdk/GO_SDK_GUIDE.md',
      remoteLocation: 'ssh -p 2235 subbu@dlt.aurigraph.io:~/aurigraph-sdk-docs/GO_SDK_GUIDE.md',
      difficulty: 'Intermediate',
      color: '#eb2f96',
      icon: <RocketOutlined style={{ fontSize: '48px', color: '#eb2f96' }} />,
      tags: ['Go', 'SDK', 'Concurrency', 'Intermediate'],
    },
    {
      id: 'grpc',
      title: 'gRPC Service Layer Guide',
      category: 'Phase 3.7: Service Architecture',
      lines: 1432,
      description: 'gRPC architecture with Protocol Buffers, service implementation, and 15.6x latency improvement over REST.',
      features: [
        'Protocol Buffer definitions',
        '17 RPC methods across 3 services',
        'TransactionService, AssetRegistryService, OracleService',
        'Streaming capabilities',
        'Client libraries for Go/TypeScript',
        'Performance optimization',
      ],
      benefits: [
        '15.6x faster than REST (125ms → 8ms)',
        'Binary protocol efficiency',
        'Built-in code generation',
        'Streaming support for real-time data',
        'Language-agnostic service contracts',
      ],
      githubPath: 'https://github.com/Aurigraph-DLT-Corp/Aurigraph-DLT/blob/V12/rwat-sdk-typescript/docs/sdk/GRPC_SERVICE_LAYER_GUIDE.md',
      remoteLocation: 'ssh -p 2235 subbu@dlt.aurigraph.io:~/aurigraph-sdk-docs/GRPC_SERVICE_LAYER_GUIDE.md',
      difficulty: 'Advanced',
      color: '#f5222d',
      icon: <ApiOutlined style={{ fontSize: '48px', color: '#f5222d' }} />,
      tags: ['gRPC', 'Protocol Buffers', 'RPC', 'Advanced'],
    },
    {
      id: 'python-advanced',
      title: 'Python SDK Advanced Guide',
      category: 'Priority 2: Advanced Patterns',
      lines: 1289,
      language: 'Python',
      description: 'Production patterns: JWT refresh, API key rotation, performance optimization, testing strategies, and observability.',
      features: [
        'JWT token refresh strategies',
        'API key rotation without downtime',
        'Smart caching with TTL/LRU',
        'Property-based testing',
        'OpenTelemetry integration',
        'Prometheus metrics collection',
        'Structured logging',
      ],
      benefits: [
        'Production-ready security',
        'Advanced performance optimization',
        'Comprehensive testing strategies',
        'Observable system behavior',
        'Enterprise deployment patterns',
      ],
      githubPath: 'https://github.com/Aurigraph-DLT-Corp/Aurigraph-DLT/blob/V12/rwat-sdk-typescript/docs/sdk/PYTHON_SDK_ADVANCED_GUIDE.md',
      remoteLocation: 'ssh -p 2235 subbu@dlt.aurigraph.io:~/aurigraph-sdk-docs/PYTHON_SDK_ADVANCED_GUIDE.md',
      difficulty: 'Advanced',
      color: '#13c2c2',
      icon: <ShieldOutlined style={{ fontSize: '48px', color: '#13c2c2' }} />,
      tags: ['Python', 'Advanced', 'Security', 'Observability', 'Advanced'],
    },
    {
      id: 'go-advanced',
      title: 'Go SDK Advanced Guide',
      category: 'Priority 2: Advanced Patterns',
      lines: 1287,
      language: 'Go',
      description: 'Production patterns: concurrency optimization, caching, testing, Docker/Kubernetes deployment, and observability.',
      features: [
        'Advanced goroutine patterns',
        'Rate limiting and backpressure',
        'Connection pool management',
        'Table-driven tests',
        'Docker optimization',
        'Kubernetes deployment',
        'Distributed tracing',
      ],
      benefits: [
        'Maximum performance optimization',
        'Enterprise-grade concurrency',
        'Container-optimized patterns',
        'Comprehensive observability',
        'Production-proven strategies',
      ],
      githubPath: 'https://github.com/Aurigraph-DLT-Corp/Aurigraph-DLT/blob/V12/rwat-sdk-typescript/docs/sdk/GO_SDK_ADVANCED_GUIDE.md',
      remoteLocation: 'ssh -p 2235 subbu@dlt.aurigraph.io:~/aurigraph-sdk-docs/GO_SDK_ADVANCED_GUIDE.md',
      difficulty: 'Advanced',
      color: '#eb2f96',
      icon: <LockOutlined style={{ fontSize: '48px', color: '#eb2f96' }} />,
      tags: ['Go', 'Advanced', 'Kubernetes', 'Performance', 'Advanced'],
    },
  ];

  const filteredGuides = sdkGuides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleGuideClick = (guide: SDKGuide) => {
    setSelectedGuide(guide);
    setDrawerVisible(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'green';
      case 'Intermediate':
        return 'orange';
      case 'Advanced':
        return 'red';
      default:
        return 'blue';
    }
  };

  const categoryGroups = {
    'Priority 1: Core Documentation': sdkGuides.filter((g) => g.category === 'Priority 1: Core Documentation'),
    'Phase 3.5-3.6: SDK Implementation': sdkGuides.filter((g) => g.category === 'Phase 3.5-3.6: SDK Implementation'),
    'Phase 3.7: Service Architecture': sdkGuides.filter((g) => g.category === 'Phase 3.7: Service Architecture'),
    'Priority 2: Advanced Patterns': sdkGuides.filter((g) => g.category === 'Priority 2: Advanced Patterns'),
  };

  return (
    <div className="sdk-page">
      {/* Hero Section */}
      <div className="sdk-hero">
        <div className="sdk-hero-content">
          <Badge.Ribbon text="6,451 Lines of Documentation" color="gold">
            <div className="sdk-hero-text">
              <Title level={1} className="sdk-hero-title">
                Aurigraph SDK Documentation
              </Title>
              <Title level={2} className="sdk-hero-subtitle">
                Complete Developer Reference for Real-World Asset Tokenization
              </Title>
              <Paragraph className="sdk-hero-description">
                Comprehensive guides covering REST APIs, Python, Go, gRPC, and advanced production patterns.
                Deploy with confidence using enterprise-grade SDKs.
              </Paragraph>

              <div className="sdk-hero-stats">
                <div className="stat-box">
                  <div className="stat-value">9</div>
                  <div className="stat-label">Complete Guides</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">6.4K+</div>
                  <div className="stat-label">Lines of Code</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">3</div>
                  <div className="stat-label">Languages</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">15.6x</div>
                  <div className="stat-label">Faster (gRPC)</div>
                </div>
              </div>

              <div className="sdk-hero-cta">
                <Button
                  type="primary"
                  size="large"
                  icon={<GithubOutlined />}
                  href="https://github.com/Aurigraph-DLT-Corp/Aurigraph-DLT/tree/V12/rwat-sdk-typescript/docs/sdk/"
                  target="_blank"
                >
                  View on GitHub
                </Button>
                <Button
                  size="large"
                  icon={<DownloadOutlined />}
                  onClick={() => navigate('/sdk-signup')}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </Badge.Ribbon>
        </div>
      </div>

      {/* Quick Access Bar */}
      <div className="sdk-search-section">
        <Row gutter={16}>
          <Col xs={24}>
            <Input
              placeholder="Search SDK guides by language, feature, or topic..."
              prefix={<SearchOutlined />}
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sdk-search-input"
            />
          </Col>
        </Row>
      </div>

      {/* SDK Guides by Category */}
      <div className="sdk-guides-section">
        {Object.entries(categoryGroups).map(([category, guides]) => (
          <div key={category} className="category-section">
            <Divider orientation="left" className="category-title">
              {category}
            </Divider>

            {guides.length > 0 ? (
              <Row gutter={[24, 24]}>
                {guides.map((guide) => (
                  <Col xs={24} md={12} lg={8} key={guide.id}>
                    <Card
                      className="sdk-guide-card"
                      hoverable
                      onClick={() => handleGuideClick(guide)}
                      style={{ borderTop: `4px solid ${guide.color}` }}
                    >
                      <div className="guide-header">
                        {guide.icon}
                        <div className="guide-title-section">
                          <Title level={5} style={{ margin: 0 }}>
                            {guide.title}
                          </Title>
                          <Tag color={getDifficultyColor(guide.difficulty)}>
                            {guide.difficulty}
                          </Tag>
                        </div>
                      </div>

                      {guide.language && (
                        <Tag color="blue" style={{ marginBottom: '8px' }}>
                          {guide.language}
                        </Tag>
                      )}

                      <Paragraph className="guide-description" ellipsis={{ rows: 2 }}>
                        {guide.description}
                      </Paragraph>

                      <div className="guide-meta">
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {guide.lines.toLocaleString()} lines
                        </Text>
                      </div>

                      <Space style={{ marginTop: '12px', flexWrap: 'wrap' }} size={[4, 8]}>
                        {guide.tags.slice(0, 3).map((tag) => (
                          <Tag key={tag} color="default">
                            {tag}
                          </Tag>
                        ))}
                      </Space>

                      <div className="guide-actions">
                        <Button
                          type="text"
                          size="small"
                          icon={<GithubOutlined />}
                          href={guide.githubPath}
                          target="_blank"
                        >
                          GitHub
                        </Button>
                        <Button
                          type="text"
                          size="small"
                          icon={<BookOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGuideClick(guide);
                          }}
                        >
                          Details
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : null}
          </div>
        ))}

        {filteredGuides.length === 0 && searchTerm && (
          <Empty description="No guides found matching your search" style={{ marginTop: '48px' }} />
        )}
      </div>

      {/* Benefits Section */}
      <div className="sdk-benefits-section">
        <Title level={2} className="section-title">
          Why Choose Aurigraph SDKs
        </Title>

        <Row gutter={[32, 32]}>
          <Col xs={24} md={12} lg={6}>
            <Card className="benefit-card" hoverable>
              <ThunderboltOutlined style={{ fontSize: '40px', color: '#faad14', marginBottom: '16px' }} />
              <Title level={5}>High Performance</Title>
              <Paragraph style={{ fontSize: '13px' }}>
                gRPC service layer delivers 15.6x faster performance than REST. Process 2M+ transactions
                per second with sub-100ms latency.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card className="benefit-card" hoverable>
              <ShieldOutlined style={{ fontSize: '40px', color: '#52c41a', marginBottom: '16px' }} />
              <Title level={5}>Quantum-Resistant</Title>
              <Paragraph style={{ fontSize: '13px' }}>
                NIST Level 5 post-quantum cryptography built-in. Future-proof your applications with
                CRYSTALS-Dilithium and Kyber.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card className="benefit-card" hoverable>
              <CloudOutlined style={{ fontSize: '40px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={5}>Multi-Language</Title>
              <Paragraph style={{ fontSize: '13px' }}>
                SDKs available for Python, Go, and TypeScript. Choose the language that fits your
                architecture and team expertise.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Card className="benefit-card" hoverable>
              <ExperimentOutlined style={{ fontSize: '40px', color: '#722ed1', marginBottom: '16px' }} />
              <Title level={5}>Production-Ready</Title>
              <Paragraph style={{ fontSize: '13px' }}>
                Comprehensive guides for authentication, security, testing, deployment, and observability.
                Deploy with confidence.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Getting Started Section */}
      <div className="sdk-getting-started">
        <Card className="getting-started-card">
          <Title level={2}>Getting Started with Aurigraph SDKs</Title>
          <Paragraph>Follow these steps to start building with Aurigraph SDKs:</Paragraph>

          <Steps
            direction="vertical"
            items={[
              {
                title: 'Choose Your Language',
                description: 'Select Python, Go, or TypeScript based on your project needs.',
              },
              {
                title: 'Read Foundation Guides',
                description: 'Start with REST API Reference, Transactions Guide, and Asset Registry Guide.',
              },
              {
                title: 'Install SDK Package',
                description: 'Install via npm, pip, or go get. See language-specific guides for details.',
              },
              {
                title: 'Review Code Examples',
                description: 'Study practical examples in basic and advanced guides for your language.',
              },
              {
                title: 'Implement Production Patterns',
                description: 'Follow advanced guides for security, caching, testing, and deployment.',
              },
              {
                title: 'Deploy with Confidence',
                description: 'Use Kubernetes configs and Docker patterns from advanced guides.',
              },
            ]}
          />

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/sdk-signup')}
              style={{ minWidth: '200px' }}
            >
              Start Development
            </Button>
          </div>
        </Card>
      </div>

      {/* Guide Details Drawer */}
      <Drawer
        title={selectedGuide ? selectedGuide.title : ''}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={500}
        bodyStyle={{ overflowY: 'auto' }}
      >
        {selectedGuide && (
          <div className="guide-details">
            <Alert
              message={`${selectedGuide.lines.toLocaleString()} lines • ${selectedGuide.category}`}
              type="info"
              style={{ marginBottom: '16px' }}
            />

            <Title level={4}>Description</Title>
            <Paragraph>{selectedGuide.description}</Paragraph>

            <Title level={4}>Key Features</Title>
            <ul>
              {selectedGuide.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>

            <Title level={4}>Benefits</Title>
            <ul>
              {selectedGuide.benefits.map((benefit, idx) => (
                <li key={idx}>{benefit}</li>
              ))}
            </ul>

            <Divider />

            <Title level={4}>Access Guide</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="primary"
                block
                icon={<GithubOutlined />}
                href={selectedGuide.githubPath}
                target="_blank"
              >
                View on GitHub
              </Button>
              <Button
                block
                icon={<FileTextOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(selectedGuide.remoteLocation);
                  alert('SSH command copied!');
                }}
              >
                Copy SSH Command
              </Button>
            </Space>
          </div>
        )}
      </Drawer>

      {/* Footer CTA */}
      <div className="sdk-footer-cta">
        <Card className="footer-cta-card">
          <Row gutter={32} align="middle">
            <Col xs={24} md={16}>
              <Title level={3} style={{ margin: 0 }}>
                Ready to Build with Aurigraph?
              </Title>
              <Paragraph style={{ marginTop: '8px', marginBottom: 0 }}>
                Access all SDKs, guides, and resources. Get started in minutes.
              </Paragraph>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
              <Space>
                <Button size="large" onClick={() => navigate('/sdk-signup')}>
                  Create Account
                </Button>
                <Button type="primary" size="large" href="https://dlt.aurigraph.io" target="_blank">
                  Access Portal
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default SDKPage;
